
import { useState } from 'react';
import { X, Plus, Image, Music } from 'lucide-react';

interface CreatePlaylistProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (name: string, description: string) => void;
}

const CreatePlaylist = ({ isOpen, onClose, onCreatePlaylist }: CreatePlaylistProps) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playlistName.trim()) {
      onCreatePlaylist(playlistName, description);
      setPlaylistName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Create playlist</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-neutral-700 rounded flex items-center justify-center">
              <Music size={24} className="text-neutral-400" />
            </div>
            <button type="button" className="text-neutral-400 hover:text-white flex items-center space-x-2">
              <Image size={16} />
              <span className="text-sm">Choose photo</span>
            </button>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full bg-neutral-700 text-white placeholder-neutral-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-6">
            <textarea
              placeholder="Add an optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-700 text-white placeholder-neutral-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-20"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!playlistName.trim()}
              className="bg-green-500 text-black px-6 py-2 rounded-full font-medium hover:bg-green-400 disabled:bg-neutral-600 disabled:text-neutral-400 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist;
