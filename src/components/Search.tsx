import { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Clock } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/media/${path.replace(/^\/+/, '')}`;
}

const Skeleton = () => (
  <div className="animate-pulse bg-neutral-800 rounded-lg h-16 w-full" />
);

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { setCurrentTrack, togglePlay } = usePlayer();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['songs', searchQuery, page],
    queryFn: async () => {
      const url = searchQuery
        ? `${API_BASE_URL}/api/auth/songs/?search=${encodeURIComponent(searchQuery)}&page=${page}`
        : `${API_BASE_URL}/api/auth/songs/?page=${page}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch songs');
      return res.json();
    },
    enabled: !!searchQuery,
  });

  const filteredSongs = data?.results || [];

  const playTrack = (song: any) => {
    setCurrentTrack({
      id: String(song.id),
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : '',
      cover: getFullUrl(song.cover_image),
      file: getFullUrl(song.file),
    });
    togglePlay();
  };

  return (
    <div className="p-6 pb-32">
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="What do you want to listen to?"
            className="w-full bg-neutral-800 text-white placeholder-neutral-400 pl-10 pr-4 py-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-neutral-700"
          />
        </div>
      </div>

      {isLoading && searchQuery && (
        <div className="space-y-2 mb-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      )}
      {error && searchQuery && (
        <div className="text-red-500 mb-6">
          Failed to load songs. <button className="underline" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {searchQuery ? (
        <>
          <div className="space-y-2">
            <div className="flex items-center space-x-4 text-neutral-400 text-sm px-4 py-2 border-b border-neutral-800">
              <div className="w-4">#</div>
              <div className="flex-1">TITLE</div>
              <div className="w-20 text-center">
                <Clock size={16} />
              </div>
            </div>
            {filteredSongs.length === 0 && !isLoading && <div className="text-neutral-400 px-4 py-6">No results found.</div>}
            {filteredSongs.map((song: any, index: number) => (
              <div
                key={song.id}
                className="flex items-center space-x-4 p-2 rounded-md hover:bg-neutral-800 cursor-pointer group"
                onClick={() => playTrack(song)}
              >
                <div className="w-4 text-neutral-400 text-sm">{index + 1 + ((page - 1) * 8)}</div>
                <img src={getFullUrl(song.cover_image)} alt={song.title} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{song.title}</p>
                  <p className="text-sm text-neutral-400 truncate">{song.artist}</p>
                </div>
                <div className="text-sm text-neutral-400">{song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : ''}</div>
                <button className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-all">
                  <Play size={12} fill="white" className="text-white ml-0.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >Prev</button>
            <span className="text-white">Page {page}</span>
            <button
              className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.next}
            >Next</button>
          </div>
        </>
      ) : (
        <div className="text-neutral-400 px-4 py-6">Type to search for songs, artists, or albums.</div>
      )}
    </div>
  );
};

export default Search;
