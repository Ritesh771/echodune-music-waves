import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/media/${path.replace(/^\/+/, '')}`;
}

const fetchPlaylists = async () => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/playlists/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch playlists');
  return res.json();
};

const createPlaylist = async (name: string) => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/playlists/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create playlist');
  return res.json();
};

const Playlists = () => {
  const queryClient = useQueryClient();
  const { data: playlists, isLoading, error } = useQuery({ queryKey: ['playlists'], queryFn: fetchPlaylists });
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const mutation = useMutation(createPlaylist, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      setShowModal(false);
      setNewName('');
    },
  });

  return (
    <div className="p-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your Playlists</h1>
        <button
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full font-medium"
          onClick={() => setShowModal(true)}
        >
          + New Playlist
        </button>
      </div>
      {isLoading && <div className="text-white">Loading playlists...</div>}
      {error && <div className="text-red-500">Failed to load playlists.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists && playlists.map((playlist: any) => (
          <div key={playlist.id} className="bg-neutral-900 p-4 rounded-lg flex flex-col items-center">
            <img
              src={getFullUrl(playlist.cover_image)}
              alt={playlist.name}
              className="w-32 h-32 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-bold text-white mb-1 truncate w-full text-center">{playlist.name}</h2>
            <p className="text-sm text-neutral-400 mb-2">{playlist.songs.length} songs</p>
            {/* TODO: Link to playlist detail page */}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold text-white mb-4">Create Playlist</h2>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-3 py-2 mb-4 rounded bg-neutral-800 text-white focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600"
                onClick={() => setShowModal(false)}
              >Cancel</button>
              <button
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-500 font-semibold"
                onClick={() => mutation.mutate(newName)}
                disabled={!newName || mutation.isLoading}
              >Create</button>
            </div>
            {mutation.isError && <div className="text-red-500 mt-2">Failed to create playlist.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists; 