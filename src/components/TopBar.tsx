
import { ChevronLeft, ChevronRight, Search, Bell, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-black bg-opacity-60 backdrop-blur-sm relative">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-80 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => window.history.forward()}
          className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-80 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black placeholder-neutral-600 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>
      </div>

      {/* User Menu */}
      <div className="flex items-center space-x-4 relative">
        <button className="text-neutral-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center text-white hover:from-purple-500 hover:to-purple-300 transition-all"
          >
            <User size={16} />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 top-10 w-48 bg-neutral-800 rounded-lg shadow-xl py-2 z-50">
              <button className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 flex items-center space-x-2">
                <User size={16} />
                <span>Profile</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 flex items-center space-x-2">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <hr className="border-neutral-600 my-2" />
              <button className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
