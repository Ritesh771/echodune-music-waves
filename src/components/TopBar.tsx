
import { ChevronLeft, ChevronRight, Search, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between p-4 bg-black bg-opacity-60 backdrop-blur-sm">
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="w-full bg-white text-black placeholder-neutral-600 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* User Menu */}
      <div className="flex items-center space-x-4">
        <button className="text-neutral-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <button className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-white hover:bg-neutral-600 transition-colors">
          <User size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
