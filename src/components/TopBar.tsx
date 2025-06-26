import { ChevronLeft, ChevronRight, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-black bg-opacity-60 backdrop-blur-sm relative border-b border-neutral-800">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={() => window.history.back()}
          className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-80 transition-colors"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <motion.button
          onClick={() => window.history.forward()}
          className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-80 transition-colors"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
      {/* User Menu */}
      <div className="flex items-center space-x-4 relative">
        <motion.button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center text-white hover:from-green-500 hover:to-green-300 transition-all"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={16} />
        </motion.button>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-10 w-48 bg-neutral-800 rounded-lg shadow-xl py-2 z-50"
          >
            <motion.button
              onClick={() => {
                navigate('/profile');
                setShowUserMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 flex items-center space-x-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <User size={16} />
              <span>Profile</span>
            </motion.button>
            <motion.button
              onClick={() => {
                navigate('/settings');
                setShowUserMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-neutral-700 flex items-center space-x-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Settings size={16} />
              <span>Settings</span>
            </motion.button>
            <hr className="border-neutral-600 my-2" />
            <motion.button
              onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-neutral-700"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Log out
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
