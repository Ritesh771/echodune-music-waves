import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import SongList, { Song } from './SongList';
import { useState } from 'react';

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/media/${path.replace(/^\/+/, '')}`;
}

const fetchPlaylist = async (id: string) => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/playlists/${id}/`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch playlist');
  return res.json();
};

const removeSongFromPlaylist = async ({ playlistId, songId }: { playlistId: string, songId: number }) => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/playlists/${playlistId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ remove_song: songId }),
  });
  if (!res.ok) throw new Error('Failed to remove song from playlist');
  return res.json();
};

const addSongToPlaylist = async ({ playlistId, songId }: { playlistId: string, songId: number }) => {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API_BASE_URL}/api/auth/playlists/${playlistId}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ add_song: songId }),
  });
  if (!res.ok) throw new Error('Failed to add song to playlist');
  return res.json();
};

const fetchSongs = async (page: number) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/songs/?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch songs');
  return res.json();
};

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: playlist, isLoading, error } = useQuery(['playlist', id], () => fetchPlaylist(id!));
  const removeMutation = useMutation(removeSongFromPlaylist, {
    onSuccess: () => queryClient.invalidateQueries(['playlist', id]),
  });
  const addMutation = useMutation(addSongToPlaylist, {
    onSuccess: () => queryClient.invalidateQueries(['playlist', id]),
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [songPage, setSongPage] = useState(1);
  const { data: songData, isLoading: isSongsLoading } = useQuery(['all-songs', songPage], () => fetchSongs(songPage), { enabled: showAddModal });

  const handleRemoveSong = (songId: number) => {
    removeMutation.mutate({ playlistId: id!, songId });
  };
  const handleAddSong = (songId: number) => {
    addMutation.mutate({ playlistId: id!, songId });
  };

  return (
    <div className="p-6 pb-32">
      <button className="text-neutral-400 hover:text-white mb-4" onClick={() => navigate(-1)}>&larr; Back</button>
      {isLoading && <div className="text-white">Loading playlist...</div>}
      {error && <div className="text-red-500">Failed to load playlist.</div>}
      {playlist && (
        <>
          <div className="flex items-center space-x-6 mb-8">
            <img
              src={getFullUrl(playlist.cover_image)}
              alt={playlist.name}
              className="w-32 h-32 object-cover rounded-md"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{playlist.name}</h1>
              <p className="text-neutral-400">{playlist.songs.length} songs</p>
              <button
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-medium"
                onClick={() => setShowAddModal(true)}
              >
                + Add Songs
              </button>
            </div>
          </div>
          <SongList
            songs={playlist.songs}
            onLikeToggle={() => {}}
            likedSongIds={[]}
          />
          <div className="mt-6">
            <h2 className="text-lg font-bold text-white mb-2">Remove a song</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlist.songs.map((song: Song) => (
                <div key={song.id} className="flex items-center space-x-2 bg-neutral-800 p-2 rounded">
                  <img src={getFullUrl(song.cover_image)} alt={song.title} className="w-10 h-10 object-cover rounded" />
                  <span className="flex-1 text-white truncate">{song.title}</span>
                  <button
                    className="text-red-400 hover:text-red-600 text-sm px-2 py-1 rounded"
                    onClick={() => handleRemoveSong(song.id)}
                  >Remove</button>
                </div>
              ))}
            </div>
          </div>
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-neutral-900 p-8 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">Add Songs to Playlist</h2>
                {isSongsLoading && <div className="text-white">Loading songs...</div>}
                {songData && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {songData.results.map((song: Song) => (
                        <div key={song.id} className="flex items-center space-x-2 bg-neutral-800 p-2 rounded">
                          <img src={getFullUrl(song.cover_image)} alt={song.title} className="w-10 h-10 object-cover rounded" />
                          <span className="flex-1 text-white truncate">{song.title}</span>
                          <button
                            className="text-green-400 hover:text-green-600 text-sm px-2 py-1 rounded"
                            onClick={() => handleAddSong(song.id)}
                          >Add</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <button
                        className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600"
                        onClick={() => setShowAddModal(false)}
                      >Close</button>
                      <div className="space-x-2">
                        <button
                          className="px-3 py-1 rounded bg-neutral-700 text-white hover:bg-neutral-600"
                          onClick={() => setSongPage((p) => Math.max(1, p - 1))}
                          disabled={songPage === 1}
                        >Prev</button>
                        <span className="text-white">Page {songPage}</span>
                        <button
                          className="px-3 py-1 rounded bg-neutral-700 text-white hover:bg-neutral-600"
                          onClick={() => setSongPage((p) => p + 1)}
                          disabled={!songData.next}
                        >Next</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistDetail; 