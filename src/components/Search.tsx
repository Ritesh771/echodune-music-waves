import { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Pause, Clock, ListMusic } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import SongList, { Song } from './SongList';

interface Playlist {
  id: number;
  name: string;
  cover_image?: string;
  songs: Song[];
}

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

const Skeleton = () => (
  <motion.div
    className="animate-pulse bg-neutral-800 rounded-lg h-16 w-full"
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ repeat: Infinity, duration: 1.2 }}
  />
);

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { setCurrentTrack, togglePlay, currentTrack, isPlaying } = usePlayer();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [songPage, setSongPage] = useState(1);
  const [artistFilter, setArtistFilter] = useState('');
  const [albumFilter, setAlbumFilter] = useState('');
  const SONGS_PER_PAGE = 12;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  // Recent searches
  const { data: recentData, refetch: refetchRecent } = useQuery({
    queryKey: ['recent-search'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/recent-search/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch recent searches');
      return res.json();
    },
  });

  // Clear recent search mutation
  const clearRecentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/recent-search/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to clear recent searches');
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-search'] });
    },
  });

  // Unified search (songs + playlists)
  const { data: searchData, isLoading, error, refetch } = useQuery<{ songs: Song[]; playlists: Playlist[] }>({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      const url = `${API_BASE_URL}/api/auth/search/?q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch search results');
      return res.json();
    },
    enabled: !!searchQuery,
  });

  const playTrack = (song: Song) => {
    setCurrentTrack({
      id: String(song.id),
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : '',
      cover: getFullUrl(song.cover_image),
      file: getFullUrl(song.file),
    });
    // Always start playing when selecting a new song
    if (!currentTrack || String(song.id) !== currentTrack.id) {
      if (!isPlaying) togglePlay();
    } else {
      // If already current, toggle play/pause
      togglePlay();
    }
  };

  return (
    <motion.div
      className="p-6 pb-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Search Input */}
      <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <motion.input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); }}
            placeholder="What do you want to listen to?"
            className="w-full bg-neutral-800 text-white placeholder-neutral-400 pl-10 pr-4 py-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green focus:bg-neutral-700"
            whileFocus={{ scale: 1.02, boxShadow: '0 0 0 2px #1DB954' }}
          />
        </div>
      </motion.div>

      {/* Recent Searches */}
      {!searchQuery && recentData && recentData.length > 0 && (
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold text-lg">Recent searches</span>
            <button
              className="text-spotify-green text-xs hover:underline"
              onClick={() => clearRecentMutation.mutate()}
            >Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentData.map((item: { id: number; query: string }) => (
              <motion.button
                key={item.id}
                className="px-4 py-2 bg-neutral-800 text-white rounded-full hover:bg-spotify-green hover:text-black transition"
                onClick={() => setSearchQuery(item.query)}
                whileTap={{ scale: 0.97 }}
              >
                {item.query}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {isLoading && searchQuery && (
          <motion.div
            className="space-y-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
          </motion.div>
        )}
      </AnimatePresence>
      {error && searchQuery && (
        <div className="text-red-500 mb-6">
          Failed to load results. <button className="underline" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {searchQuery && searchData && (
        <>
          {/* Songs Section */}
          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center mb-2 gap-4">
              <Play className="text-spotify-green" size={20} />
              <span className="text-white font-semibold text-lg">Songs</span>
              <input
                type="text"
                className="px-2 py-1 rounded bg-neutral-800 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-spotify-green text-xs"
                placeholder="Filter by artist"
                value={artistFilter}
                onChange={e => { setArtistFilter(e.target.value); setSongPage(1); }}
                style={{ minWidth: 120 }}
              />
              <input
                type="text"
                className="px-2 py-1 rounded bg-neutral-800 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-spotify-green text-xs"
                placeholder="Filter by album"
                value={albumFilter}
                onChange={e => { setAlbumFilter(e.target.value); setSongPage(1); }}
                style={{ minWidth: 120 }}
              />
            </div>
            {(searchData.songs as Song[]) && (searchData.songs as Song[]).length > 0 ? (() => {
              // Filter and paginate songs
              const filtered: Song[] = (searchData.songs as Song[]).filter((song: Song) =>
                (!artistFilter || song.artist.toLowerCase().includes(artistFilter.toLowerCase())) &&
                (!albumFilter || (song.album || '').toLowerCase().includes(albumFilter.toLowerCase()))
              );
              const totalPages = Math.ceil(filtered.length / SONGS_PER_PAGE);
              const startIdx = (songPage - 1) * SONGS_PER_PAGE;
              const pageSongs = filtered.slice(startIdx, startIdx + SONGS_PER_PAGE);
              return filtered.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {pageSongs.map((song: Song, index: number) => (
                      <motion.div
                        key={song.id}
                        className={`flex items-center space-x-4 p-2 rounded-md cursor-pointer group transition ${currentTrack && String(song.id) === currentTrack.id ? 'bg-neutral-800 ring-2 ring-spotify-green' : 'hover:bg-neutral-800'}`}
                        onClick={() => playTrack(song)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-4 text-neutral-400 text-sm">{startIdx + index + 1}</div>
                        <img src={getFullUrl(song.cover_image)} alt={song.title} className="w-10 h-10 rounded-md object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{song.title}</p>
                          <p className="text-sm text-neutral-400 truncate">{song.artist}</p>
                        </div>
                        <div className="text-sm text-neutral-400">{song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : ''}</div>
                        <motion.button
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentTrack && String(song.id) === currentTrack.id ? 'bg-spotify-green' : 'bg-neutral-700 group-hover:bg-spotify-green'}`}
                          onClick={e => { e.stopPropagation(); playTrack(song); }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {currentTrack && String(song.id) === currentTrack.id && isPlaying ? (
                            <Pause size={16} fill="white" className="text-white ml-0.5" />
                          ) : (
                            <Play size={16} fill="white" className="text-white ml-0.5" />
                          )}
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      className="px-4 py-2 rounded bg-neutral-800 text-white disabled:opacity-50"
                      onClick={() => setSongPage(p => Math.max(1, p - 1))}
                      disabled={songPage === 1}
                    >Previous</button>
                    <span className="text-neutral-400">Page {songPage} / {totalPages}</span>
                    <button
                      className="px-4 py-2 rounded bg-neutral-800 text-white disabled:opacity-50"
                      onClick={() => setSongPage(p => Math.min(totalPages, p + 1))}
                      disabled={songPage === totalPages}
                    >Next</button>
                  </div>
                </>
              ) : (
                <div className="text-neutral-400 px-4 py-6">No songs found.</div>
              );
            })() : (
              <div className="text-neutral-400 px-4 py-6">No songs found.</div>
            )}
          </motion.div>
          {/* Playlists Section */}
          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center mb-2">
              <ListMusic className="text-spotify-green mr-2" size={20} />
              <span className="text-white font-semibold text-lg">Playlists</span>
            </div>
            {searchData.playlists && searchData.playlists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchData.playlists.map((playlist: Playlist) => (
                  <motion.div
                    key={playlist.id}
                    className="bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group transform hover:scale-105"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative mb-4">
                      <img
                        src={playlist.cover_image ? getFullUrl(playlist.cover_image) : '/placeholder.svg'}
                        alt={playlist.name}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
                    <p className="text-sm text-neutral-400 truncate">{playlist.songs?.length || 0} songs</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-400 px-4 py-6">No playlists found.</div>
            )}
          </motion.div>
        </>
      )}

      {!searchQuery && (!recentData || recentData.length === 0) && (
        <div className="text-neutral-400 px-4 py-6">Type to search for songs, artists, or playlists.</div>
      )}
    </motion.div>
  );
};

export default Search;
