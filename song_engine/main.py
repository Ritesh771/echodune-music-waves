import logging
import os
import json
import time
import hashlib
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import heapq
import threading


import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from sentence_transformers import SentenceTransformer
from yt_dlp import YoutubeDL

# ----------------------- Config -----------------------
CACHE_DIR = "song_cache"
CACHE_DB = os.path.join(CACHE_DIR, "cache.json")
CHROMA_DIR = "chroma"
TTL_SECONDS = 7 * 24 * 60 * 60  # 7 days
os.makedirs(CACHE_DIR, exist_ok=True)

# -------------------- Embeddings ----------------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
embedding_fn = SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# --------------------- Vector DB ----------------------
chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
collection = chroma_client.get_or_create_collection(name="songs", embedding_function=embedding_fn)

# --------------------- Vector DB ----------------------
def init_logger():
    GREEN = "\033[92m"
    RED = "\033[91m"
    RESET = "\033[0m"

    class ColorFormatter(logging.Formatter):
        def format(self, record):
            if record.levelname == "INFO":
                record.levelname = f"{GREEN}{record.levelname}{RESET}"
            elif record.levelname == "ERROR":
                record.levelname = f"{RED}{record.levelname}{RESET}"
            return super().format(record)

    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        ch = logging.StreamHandler()
        ch.setLevel(logging.INFO)
        formatter = ColorFormatter('%(levelname)s:     %(message)s')
        ch.setFormatter(formatter)
        logger.addHandler(ch)

# --------------------- Cache JSON ---------------------
if os.path.exists(CACHE_DB):
    with open(CACHE_DB, 'r') as f:
        cache_index = json.load(f)
else:
    cache_index = {}

def save_cache():
    with open(CACHE_DB, 'w') as f:
        json.dump(cache_index, f, indent=2)

def cleanup_expired():
    now = time.time()
    changed = False

    while expiry_heap and expiry_heap[0][0] + TTL_SECONDS < now:
        ts, query = heapq.heappop(expiry_heap)
        if query in cache_index:
            path = cache_index[query]['path']
            if os.path.exists(path):
                os.remove(path)
            try:
                collection.delete(ids=[cache_index[query]['id']])
            except:
                pass
            del cache_index[query]
            changed = True

    if changed:
        save_cache()
        save_heap()

# --------------------- Heap Congig --------------------
HEAP_FILE = os.path.join(CACHE_DIR, "expiry_heap.json")

expiry_heap = []

if os.path.exists(HEAP_FILE):
    with open(HEAP_FILE, 'r') as f:
        expiry_heap = json.load(f)
    heapq.heapify(expiry_heap)
else:
    for query, data in cache_index.items():
        expiry_heap.append([data['timestamp'], query])
    heapq.heapify(expiry_heap)

def save_heap():
    with open(HEAP_FILE, 'w') as f:
        json.dump(expiry_heap, f)

# ---------------------- Cleanup Thread ----------------------
def periodic_cleanup(interval_seconds=300):  # every 5 minute
    logging.info("[ TTL Prune Thread ] : Active")
    while True:
        try:
            cleanup_expired()
        except Exception as e:
            logging.error(f"[TTL Prune] Error: {e}")
        time.sleep(interval_seconds)

# ---------------------- Download ----------------------
def download_song(query: str, song_id: str):
    filename = os.path.join(CACHE_DIR, f"{song_id}.mp3")
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': filename,
        'quiet': True,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([f"ytsearch1:{query}"])
    return filename

# ---------------------- Serving -----------------------
def serve_song(query: str, threshold: float = 0.7):
    cleanup_expired()
    
    matches = collection.query(query_texts=[query], n_results=1)

    if matches['ids'][0]:
        match_id = matches['ids'][0][0]
        distance = matches['distances'][0][0]
        
        if distance <= threshold:  # Lower distance = better match
            for k, v in cache_index.items():
                if v['id'] == match_id:
                    return {"source": "cache", "title": k, "path": v['path']}
    
    # No valid match found, download it
    song_id = hashlib.md5(query.encode()).hexdigest()
    path = download_song(query, song_id)

    # Update vector DB
    collection.add(documents=[query], ids=[song_id])

    # Update cache index
    cache_index[query] = {
        'path': path,
        'timestamp': time.time(),
        'id': song_id
    }
    heapq.heappush(expiry_heap, [cache_index[query]['timestamp'], query])
    save_heap()
    save_cache()
    return {"source": "download", "title": query, "path": path}

# -------------------- FastAPI Setup -------------------
app = FastAPI()

class SongRequest(BaseModel):
    query: str

@app.post("/song")
def get_song(data: SongRequest):
    try:
        result = serve_song(data.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/cache/status")
def cache_status(limit: int = 10):
    now = time.time()
    upcoming = []

    for ts, query in sorted(expiry_heap)[:limit]:
        time_left = max(0, (ts + TTL_SECONDS) - now)
        upcoming.append({
            "title": query,
            "expires_in_seconds": int(time_left),
            "path": cache_index.get(query, {}).get("path", "unknown")
        })

    return {"upcoming_expirations": upcoming}

init_logger() # Initialize logger
threading.Thread(target=periodic_cleanup, daemon=True).start() # Start Pruning TTL Thread
