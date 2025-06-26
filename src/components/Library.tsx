
import { useState } from 'react';
import { Search, List, MoreHorizontal, Play } from 'lucide-react';

const Library = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const libraryItems = [
    {
      id: '1',
      type: 'playlist',
      name: 'Liked Songs',
      details: '127 songs',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      gradient: 'from-purple-700 to-blue-300'
    },
    {
      id: '2',
      type: 'playlist',
      name: 'My Playlist #1',
      details: '23 songs',
      image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop',
    },
    {
      id: '3',
      type: 'artist',
      name: 'The Weeknd',
      details: 'Artist',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    },
    {
      id: '4',
      type: 'album',
      name: 'After Hours',
      details: 'The Weeknd • 2020',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    },
    {
      id: '5',
      type: 'playlist',
      name: 'Discover Weekly',
      details: '30 songs',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    },
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'playlists', label: 'Playlists' },
    { key: 'artists', label: 'Artists' },
    { key: 'albums', label: 'Albums' },
  ];

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        <div className="flex items-center space-x-4">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="text-neutral-400 hover:text-white transition-colors">
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.key}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-sm font-medium transition-colors"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-4 mb-6">
        <button className="text-sm text-neutral-400 hover:text-white transition-colors">
          Recently Added
        </button>
        <button className="text-sm text-neutral-400 hover:text-white transition-colors">
          Alphabetical
        </button>
      </div>

      {/* Library Items */}
      <div className="space-y-2">
        {libraryItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-800 cursor-pointer group"
          >
            <div className="relative">
              {item.gradient ? (
                <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <span className="text-white text-lg">♥</span>
                </div>
              ) : (
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-12 h-12 object-cover ${item.type === 'artist' ? 'rounded-full' : 'rounded-md'}`}
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{item.name}</p>
              <p className="text-sm text-neutral-400 truncate">{item.details}</p>
            </div>

            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors">
                <Play size={12} fill="black" className="text-black ml-0.5" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
