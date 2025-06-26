import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import SongList, { Song } from './SongList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Playlist {
  id: number;
  name: string;
  cover_image?: string;
  songs: Song[];
}

const Skeleton = () => (
  <motion.div
    className="animate-pulse bg-neutral-800 rounded-lg h-64 w-full"
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ repeat: Infinity, duration: 1.2 }}
  />
);

const PlaylistCard = ({ playlist }: { playlist: Playlist }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.98 }}
    className="bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group shadow-lg"
  >
    <div className="relative mb-4">
      <img
        src={playlist.cover_image ? `${API_BASE_URL}/media/${playlist.cover_image}` : '/placeholder.svg'}
        alt={playlist.name}
        className="w-full aspect-square object-cover rounded-md"
      />
    </div>
    <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
    <p className="text-sm text-neutral-400 truncate">{playlist.songs.length} songs</p>
  </motion.div>
);

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const Library = () => {
  const [tab, setTab] = useState<'playlists' | 'liked' | 'downloads'>('playlists');

  // Playlists
  const { data: playlistsData, isLoading: playlistsLoading, error: playlistsError, refetch: refetchPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/playlists/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch playlists');
      return res.json();
    },
  });

  // Liked Songs
  const { data: likedData, isLoading: likedLoading, error: likedError, refetch: refetchLiked } = useQuery({
    queryKey: ['liked-songs'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch liked songs');
      return res.json();
    },
  });

  // Downloads
  const { data: downloadsData, isLoading: downloadsLoading, error: downloadsError, refetch: refetchDownloads } = useQuery({
    queryKey: ['downloads'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/downloads/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch downloads');
      return res.json();
    },
  });

  return (
    <motion.div
      className="p-6 pb-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">Your Library</h1>
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full font-semibold transition-all ${tab === 'playlists' ? 'bg-spotify-green text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
          onClick={() => setTab('playlists')}
        >Playlists</button>
        <button
          className={`px-4 py-2 rounded-full font-semibold transition-all ${tab === 'liked' ? 'bg-spotify-green text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
          onClick={() => setTab('liked')}
        >Liked Songs</button>
        <button
          className={`px-4 py-2 rounded-full font-semibold transition-all ${tab === 'downloads' ? 'bg-spotify-green text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
          onClick={() => setTab('downloads')}
        >Downloads</button>
      </div>
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tab === 'playlists' && (
          <motion.div
            key="playlists"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {playlistsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
              </div>
            )}
            {playlistsError && (
              <div className="text-red-500 mb-6">
                Failed to load playlists. <button className="underline" onClick={() => refetchPlaylists()}>Retry</button>
              </div>
            )}
            {playlistsData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlistsData.map((playlist: Playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            )}
          </motion.div>
        )}
        {tab === 'liked' && (
          <motion.div
            key="liked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {likedLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
              </div>
            )}
            {likedError && (
              <div className="text-red-500 mb-6">
                Failed to load liked songs. <button className="underline" onClick={() => refetchLiked()}>Retry</button>
              </div>
            )}
            {likedData && <SongList songs={likedData.map((item: { song: Song }) => item.song)} />}
          </motion.div>
        )}
        {tab === 'downloads' && (
          <motion.div
            key="downloads"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {downloadsLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
              </div>
            )}
            {downloadsError && (
              <div className="text-red-500 mb-6">
                Failed to load downloads. <button className="underline" onClick={() => refetchDownloads()}>Retry</button>
              </div>
            )}
            {downloadsData && <SongList songs={downloadsData.map((item: { song: Song }) => item.song)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Library;
