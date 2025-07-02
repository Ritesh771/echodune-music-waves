import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import SongList, { Song } from './SongList';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

const fetchPlaylists = async () => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/playlists/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch playlists');
  return res.json();
};

const createPlaylist = async ({ name }: { name: string }) => {
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

interface Playlist {
  id: number;
  name: string;
  cover_image?: string;
  songs: Song[];
}

const Playlists = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setQueue, playTrack } = usePlayer();
  const { data: playlists, isLoading, error } = useQuery({ queryKey: ['playlists'], queryFn: fetchPlaylists });
  // Debug log
  console.log('Playlists API response:', playlists);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const mutation = useMutation({
    mutationFn: createPlaylist,
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
        {playlists && playlists.map((playlist: Playlist) => {
          // Convert playlist.songs to Track[] for the player
          const tracks = playlist.songs.map(song => ({
            id: String(song.id),
            title: song.title,
            artist: song.artist,
            album: song.album,
            duration: String(song.duration),
            cover: song.cover_image || '',
            file: song.file,
          }));
          return (
            <div
              key={playlist.id}
              className="relative bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-xl shadow-lg flex flex-col items-center cursor-pointer group overflow-hidden hover:scale-[1.03] transition-transform duration-200"
              onClick={() => navigate(`/playlists/${playlist.id}`)}
            >
              <div className="relative w-full aspect-square bg-neutral-800 flex items-center justify-center">
                <img
                  src={getFullUrl(playlist.cover_image)}
                  alt={playlist.name}
                  className="w-full h-full object-cover rounded-t-xl group-hover:brightness-90 transition"
                />
                <button
                  className="absolute bottom-4 right-4 bg-spotify-green text-black rounded-full p-4 shadow-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-110 transition-all duration-200 z-10 hover:scale-125 hover:shadow-2xl"
                  onClick={e => {
                    e.stopPropagation();
                    if (tracks.length > 0) {
                      setQueue(tracks, 0);
                      playTrack(tracks[0], tracks, 0);
                    }
                  }}
                  aria-label={`Play ${playlist.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                    <path d="M5 3.867v16.266c0 1.068 1.14 1.728 2.08 1.18l13.04-8.133c.92-.574.92-1.786 0-2.36L7.08 2.687C6.14 2.14 5 2.8 5 3.867z" />
                  </svg>
                </button>
              </div>
              <div className="w-full flex flex-col items-center px-2 py-4">
                <h2 className="text-base font-bold text-white mb-1 truncate w-full text-center group-hover:text-spotify-green transition-colors">{playlist.name}</h2>
                <p className="text-xs text-neutral-400 mb-0.5">{playlist.songs.length} song{playlist.songs.length === 1 ? '' : 's'}</p>
              </div>
            </div>
          );
        })}
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
                onClick={() => {
                  console.log('Create playlist clicked:', newName);
                  mutation.mutate({ name: newName });
                }}
                disabled={!newName || mutation.isPending}
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

