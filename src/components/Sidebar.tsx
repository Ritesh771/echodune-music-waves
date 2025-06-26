
import { Home, Search, BookOpen, Plus, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: BookOpen, label: 'Your Library', path: '/library' },
  ];

  const playlists = [
    'Liked Songs',
    'My Playlist #1',
    'Discover Weekly',
    'Release Radar',
    'Chill Mix',
    'Rock Classics',
    'Pop Hits',
    'Jazz Vibes',
  ];

  return (
    <div className="w-64 bg-black flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center">
        <img 
          src="/lovable-uploads/7d38d044-4519-4c74-ba26-abe3b4168fb0.png" 
          alt="Echodune" 
          className="h-12 w-auto"
        />
      </div>

      {/* Main Navigation */}
      <nav className="px-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center space-x-4 w-full px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
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
        <button className="flex items-center space-x-4 w-full px-4 py-3 text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-800">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-purple-400 rounded-sm flex items-center justify-center">
            <Plus size={16} />
          </div>
          <span className="text-sm font-medium">Create Playlist</span>
        </button>
        
        <button className="flex items-center space-x-4 w-full px-4 py-3 text-neutral-400 hover:text-white transition-colors rounded-md hover:bg-neutral-800">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-700 to-pink-500 rounded-sm flex items-center justify-center">
            <Heart size={16} />
          </div>
          <span className="text-sm font-medium">Liked Songs</span>
        </button>
      </div>

      {/* Playlists */}
      <div className="flex-1 px-2 mt-4 overflow-y-auto">
        <div className="space-y-1">
          {playlists.map((playlist, index) => (
            <button
              key={index}
              className="block w-full text-left px-4 py-2 text-neutral-400 hover:text-white transition-colors text-sm rounded-md hover:bg-neutral-800"
            >
              {playlist}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
