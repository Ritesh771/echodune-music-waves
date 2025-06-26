import { Home, Search, BookOpen, Plus, Heart, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import CreatePlaylist from './CreatePlaylist';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlists, setPlaylists] = useState([
    'Liked Songs',
    'My Playlist #1',
    'Discover Weekly',
    'Release Radar',
    'Chill Mix',
    'Rock Classics',
    'Pop Hits',
    'Jazz Vibes',
  ]);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: BookOpen, label: 'Your Library', path: '/library' },
  ];

  const handleCreatePlaylist = (name: string, description: string) => {
    setPlaylists(prev => [name, ...prev]);
    console.log('Created playlist:', { name, description });
  };

  const handlePlaylistClick = (playlist: string) => {
    if (playlist === 'Liked Songs') {
      navigate('/liked-songs');
    } else {
      console.log('Opening playlist:', playlist);
    }
  };

  return (
    <>
      <div className="w-64 bg-black flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 flex items-center justify-center space-x-3">
          <img 
            src="/lovable-uploads/8a136392-25ae-486d-87dc-6f4f1494fc99.png" 
            alt="EchoDune" 
            className="h-10 w-auto"
          />
          <span className="text-white text-xl font-bold">EchoDune</span>
        </div>

        {/* Main Navigation */}
        <nav className="px-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-4 w-full px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Create Playlist */}
        <div className="px-2 mt-8">
          <button 
            onClick={() => setShowCreatePlaylist(true)}
            className="flex items-center space-x-4 w-full px-4 py-3 text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-800"
          >
            <div className="w-6 h-6 bg-neutral-600 rounded-sm flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span className="text-sm font-medium">Create Playlist</span>
          </button>
          
          <button 
            onClick={() => navigate('/liked-songs')}
            className="flex items-center space-x-4 w-full px-4 py-3 text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-800"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-500 rounded-sm flex items-center justify-center">
              <Heart size={16} />
            </div>
            <span className="text-sm font-medium">Liked Songs</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center space-x-4 w-full px-4 py-3 text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-800"
          >
            <div className="w-6 h-6 bg-neutral-600 rounded-sm flex items-center justify-center">
              <LogOut size={16} />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Playlists */}
        <div className="flex-1 px-2 mt-4 overflow-y-auto">
          <div className="space-y-1">
            {playlists.map((playlist, index) => (
              <button
                key={index}
                onClick={() => handlePlaylistClick(playlist)}
                className="block w-full text-left px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm rounded-md hover:bg-neutral-800"
              >
                {playlist}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CreatePlaylist
        isOpen={showCreatePlaylist}
        onClose={() => setShowCreatePlaylist(false)}
        onCreatePlaylist={handleCreatePlaylist}
      />
    </>
  );
};

export default Sidebar;
