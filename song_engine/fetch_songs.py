import os
import json
import time
import hashlib
from yt_dlp import YoutubeDL
from rapidfuzz import process, fuzz
import certifi

os.environ['SSL_CERT_FILE'] = certifi.where()

CACHE_DIR = "song_cache"
CACHE_DB = os.path.join(CACHE_DIR, "cache.json")
CACHE_TTL_SECONDS = 7 * 24 * 60 * 60  # 7 days

os.makedirs(CACHE_DIR, exist_ok=True)

# Load cache index
if os.path.exists(CACHE_DB):
    with open(CACHE_DB, 'r') as f:
        cache_index = json.load(f)
else:
    cache_index = {}

def save_cache():
    with open(CACHE_DB, 'w') as f:
        json.dump(cache_index, f, indent=2)

def hash_query(query):
    return hashlib.md5(query.encode()).hexdigest()

def is_expired(entry):
    return (time.time() - entry['timestamp']) > CACHE_TTL_SECONDS

def find_similar_cached_song(query, threshold=85):
    valid_entries = {k: v for k, v in cache_index.items() if not is_expired(v)}
    if not valid_entries:
        return None, None
    best_match, score, _ = process.extractOne(query, valid_entries.keys(), scorer=fuzz.token_sort_ratio)
    if score >= threshold:
        return best_match, valid_entries[best_match]['path']
    return None, None

def cleanup_expired_cache():
    expired = [k for k, v in cache_index.items() if is_expired(v)]
    for key in expired:
        path = cache_index[key]['path']
        if os.path.exists(path):
            os.remove(path)
        del cache_index[key]
    if expired:
        save_cache()

def download_and_cache_song(query):
    hashed = hash_query(query)
    cached_path = os.path.join(CACHE_DIR, f"{hashed}.mp3")
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': cached_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        print(f"🔽 Downloading '{query}'...")
        ydl.download([f"ytsearch1:{query}"])
    
    cache_index[query] = {
        'path': cached_path,
        'timestamp': time.time()
    }
    save_cache()
    print(f"✅ Downloaded and cached: {cached_path}")
    return cached_path

def serve_song(query):
    cleanup_expired_cache()
    match, path = find_similar_cached_song(query)
    if match:
        print(f"📂 Served from cache (matched '{match}'): {path}")
    else:
        path = download_and_cache_song(query)
        print(f"🚀 Served newly downloaded: {path}")
    return path

# Example usage
if __name__ == "__main__":
    query = input("🎵 Enter song title: ")
    serve_song(query)
