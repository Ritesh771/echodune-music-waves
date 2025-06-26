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

const Home = () => {
  const [page, setPage] = useState(1);
  const { data: recData, isLoading: recLoading, error: recError, refetch: refetchRec } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/recommendations/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return res.json();
    },
  });

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      className="p-6 pb-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-spotify-green to-purple-400 bg-clip-text text-transparent animate-gradient">
          {getGreeting()}
        </h1>
      </motion.div>
      {/* Recommended Section */}
      <motion.div className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-white mb-4">Recommended for you</h2>
        <AnimatePresence>
          {recLoading && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
            </motion.div>
          )}
        </AnimatePresence>
        {recError && (
          <div className="text-red-500 mb-6">
            Failed to load recommendations. <button className="underline" onClick={() => refetchRec()}>Retry</button>
          </div>
        )}
        {recData && <SongList songs={recData} />}
      </motion.div>
      {/* Playlists Section */}
      <motion.div className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-2xl font-bold text-white mb-4">Your Playlists</h2>
        <AnimatePresence>
          {playlistsLoading && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
            </motion.div>
          )}
        </AnimatePresence>
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
    </motion.div>
  );
};

export default Home;
