import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import SongList, { Song } from './SongList';
import { motion, AnimatePresence } from 'framer-motion';

const fetchLikedSongs = async () => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch liked songs');
  return res.json();
};

const unlikeSong = async ({ songId }: { songId: number }) => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/${songId}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to unlike song');
};

const Skeleton = () => (
  <motion.div
    className="animate-pulse bg-neutral-800 rounded-lg h-64 w-full"
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ repeat: Infinity, duration: 1.2 }}
  />
);

const LikedSongs = () => {
  const queryClient = useQueryClient();
  type LikedSongResponse = { song: Song }[];
  const { data, isLoading, error } = useQuery<LikedSongResponse>({
    queryKey: ['liked-songs'],
    queryFn: fetchLikedSongs,
  });
  const mutation = useMutation({
    mutationFn: unlikeSong,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liked-songs'] }),
  });

  const likedSongIds = data ? data.map((item) => item.song.id) : [];
  const songs = data ? data.map((item) => item.song) : [];

  return (
    <motion.div
      className="p-6 pb-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">Liked Songs</h1>
      <AnimatePresence>
        {isLoading && (
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
      {error && <div className="text-red-500">Failed to load liked songs.</div>}
      <SongList songs={songs} likedSongIds={likedSongIds} onLikeToggle={(songId) => mutation.mutate({ songId })} />
    </motion.div>
  );
};

export default LikedSongs;
