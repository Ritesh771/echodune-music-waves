import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Search as SearchIcon, Library as LibraryIcon, Heart, User, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Search', path: '/search', icon: SearchIcon },
  { label: 'Library', path: '/library', icon: LibraryIcon },
  { label: 'Liked Songs', path: '/liked-songs', icon: Heart },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-black flex flex-col h-full border-r border-neutral-800 sticky top-0 z-30">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center space-x-3">
        <img 
          src="/lovable-uploads/8a136392-25ae-486d-87dc-6f4f1494fc99.png" 
          alt="EchoDune" 
          className="h-10 w-auto"
        />
        <span className="text-white text-xl font-bold tracking-wide">EchoDune</span>
      </div>
      {/* Main Navigation */}
      <nav className="flex-1 px-2 space-y-1 mt-4">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center space-x-4 w-full px-4 py-3 rounded-md text-base font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-neutral-800 text-white shadow-lg'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(40,40,40,0.9)' }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
      {/* Bottom User/Settings */}
      <div className="px-2 py-6 border-t border-neutral-800 mt-auto flex flex-col gap-2">
        <motion.button
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-3 w-full px-4 py-2 rounded-md text-base text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(40,40,40,0.9)' }}
          whileTap={{ scale: 0.98 }}
        >
          <User size={20} />
          <span>Profile</span>
        </motion.button>
        <motion.button
          onClick={() => navigate('/settings')}
          className="flex items-center space-x-3 w-full px-4 py-2 rounded-md text-base text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(40,40,40,0.9)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings size={20} />
          <span>Settings</span>
        </motion.button>
        <motion.button
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="flex items-center space-x-3 w-full px-4 py-2 rounded-md text-base text-red-400 hover:text-white hover:bg-red-600/80 transition-all mt-2"
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(220,38,38,0.1)' }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={20} />
          <span>Log out</span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
