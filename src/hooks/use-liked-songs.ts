import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';

export function useLikedSongs() {
  const queryClient = useQueryClient();

  // Fetch liked songs
  const { data, isLoading, error } = useQuery<number[]>({
    queryKey: ['liked-songs'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/ids/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch liked songs');
      return res.json(); // should be an array of song IDs
    },
  });

  // Like a song
  const likeMutation = useMutation({
    mutationFn: async (songId: number) => {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/${songId}/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to like song');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liked-songs'] });
      queryClient.invalidateQueries({ queryKey: ['liked-songs-list'] });
    },
  });

  // Unlike a song
  const unlikeMutation = useMutation({
    mutationFn: async (songId: number) => {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/auth/liked-songs/${songId}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to unlike song');
      return songId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liked-songs'] });
      queryClient.invalidateQueries({ queryKey: ['liked-songs-list'] });
    },
  });

  const likedSongIds = data || [];
  const isLiked = (songId: number) => likedSongIds.includes(songId);

  return {
    likedSongIds,
    isLoading,
    error,
    isLiked,
    likeSong: (songId: number) => likeMutation.mutate(songId),
    unlikeSong: (songId: number) => unlikeMutation.mutate(songId),
    liking: likeMutation.status === 'pending',
    unliking: unlikeMutation.status === 'pending',
  };
} 