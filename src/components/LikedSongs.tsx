import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import SongList, { Song } from './SongList';

const fetchLikedSongs = async () => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch liked songs');
  return res.json();
};

const unlikeSong = async (songId: number) => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/${songId}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to unlike song');
};

const LikedSongs = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery(['liked-songs'], fetchLikedSongs);
  const mutation = useMutation(unlikeSong, {
    onSuccess: () => queryClient.invalidateQueries(['liked-songs']),
  });

  const likedSongIds = data ? data.map((item: any) => item.song.id) : [];
  const songs = data ? data.map((item: any) => item.song) : [];

  return (
    <div className="p-6 pb-32">
      <h1 className="text-2xl font-bold text-white mb-6">Liked Songs</h1>
      {isLoading && <div className="text-white">Loading liked songs...</div>}
      {error && <div className="text-red-500">Failed to load liked songs.</div>}
      <SongList songs={songs} likedSongIds={likedSongIds} onLikeToggle={(songId) => mutation.mutate(songId)} />
    </div>
  );
};

export default LikedSongs;
