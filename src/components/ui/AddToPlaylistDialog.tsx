import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../../config';

interface AddToPlaylistDialogProps {
  open: boolean;
  songId: number | null;
  onClose: () => void;
}

interface Playlist {
  id: number;
  name: string;
  cover_image?: string;
  songs?: { id: number }[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

const AddToPlaylistDialog = ({ open, songId, onClose }: AddToPlaylistDialogProps) => {
  const queryClient = useQueryClient();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);
  const { data: playlists, refetch } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/playlists/`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch playlists');
      return res.json();
    },
    enabled: open,
  });

  const addMutation = useMutation({
    mutationFn: async (playlistId: number) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/playlists/${playlistId}/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ add_song: songId }),
      });
      if (!res.ok) throw new Error('Failed to add song to playlist');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      onClose();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/playlists/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to create playlist');
      return res.json();
    },
    onSuccess: (data) => {
      setCreating(false);
      setNewPlaylistName('');
      refetch();
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (playlistId: number) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/playlists/${playlistId}/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remove_song: songId }),
      });
      if (!res.ok) throw new Error('Failed to remove song from playlist');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      refetch();
    },
  });

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  if (!open || !songId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-xs">
        <h2 className="text-lg font-bold text-white mb-4">Add to Playlist</h2>
        <div className="mb-4">
          {playlists && playlists.length > 0 ? (
            <ul className="space-y-2">
              {playlists.map((playlist: Playlist) => {
                const inPlaylist = playlist.songs && playlist.songs.some(s => s.id === songId);
                return (
                  <li key={playlist.id} className="flex items-center gap-2">
                    <img
                      src={getFullUrl(playlist.cover_image)}
                      alt={playlist.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="flex-1 text-white truncate">{playlist.name}</span>
                    {inPlaylist ? (
                      <button
                        className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
                        onClick={() => removeMutation.mutate(playlist.id)}
                        disabled={removeMutation.isPending}
                      >Remove</button>
                    ) : (
                      <button
                        className="px-2 py-1 rounded bg-spotify-green text-black hover:bg-green-500 text-xs"
                        onClick={() => addMutation.mutate(playlist.id)}
                        disabled={addMutation.isPending}
                      >Add</button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-neutral-400">No playlists found.</div>
          )}
        </div>
        <div className="mb-4 border-t border-neutral-700 pt-4">
          {creating ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                if (newPlaylistName.trim()) {
                  createMutation.mutate(newPlaylistName);
                }
              }}
            >
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-neutral-800 text-white placeholder:text-neutral-400 mb-2"
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-spotify-green text-black px-4 py-2 rounded font-semibold hover:bg-green-500"
                  disabled={!newPlaylistName.trim() || createMutation.isPending}
                >Create</button>
                <button
                  type="button"
                  className="bg-neutral-700 text-white px-4 py-2 rounded font-semibold hover:bg-neutral-600"
                  onClick={() => setCreating(false)}
                >Cancel</button>
              </div>
              {createMutation.isError && <div className="text-red-500 mt-2">Failed to create playlist.</div>}
            </form>
          ) : (
            <button
              className="w-full px-4 py-2 rounded bg-neutral-800 text-white hover:bg-purple-600 transition"
              onClick={() => setCreating(true)}
            >+ New Playlist</button>
          )}
        </div>
        <button
          className="w-full mt-2 px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600 transition"
          onClick={onClose}
        >Cancel</button>
        {addMutation.isError && <div className="text-red-500 mt-2">Failed to add song to playlist.</div>}
      </div>
    </div>
  );
};

export default AddToPlaylistDialog; 