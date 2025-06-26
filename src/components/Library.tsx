
import { useState } from 'react';
import { Search, List, Grid3X3, MoreHorizontal, Play, Plus, Download } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const Library = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('list');
  const { setCurrentTrack, togglePlay } = usePlayer();

  const libraryItems = [
    {
      id: '1',
      type: 'playlist',
      name: 'Liked Songs',
      details: '127 songs',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      gradient: 'from-purple-700 to-pink-500'
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

  const sortOptions = [
    { key: 'recent', label: 'Recently Added' },
    { key: 'alphabetical', label: 'Alphabetical' },
    { key: 'creator', label: 'Creator' },
  ];

  const filteredItems = libraryItems.filter(item => 
    activeFilter === 'all' || item.type === activeFilter.slice(0, -1)
  );

  const playItem = (item: any) => {
    setCurrentTrack({
      id: item.id,
      title: item.name,
      artist: item.type === 'artist' ? item.name : 'Various Artists',
      album: item.name,
      duration: '3:45',
      cover: item.image,
    });
    togglePlay();
  };

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        <div className="flex items-center space-x-4">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            {viewMode === 'list' ? <Grid3X3 size={20} /> : <List size={20} />}
          </button>
          <button className="text-neutral-400 hover:text-white transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === filter.key
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-4 mb-6">
        {sortOptions.map((option) => (
          <button 
            key={option.key}
            onClick={() => setSortBy(option.key)}
            className={`text-sm transition-colors ${
              sortBy === option.key 
                ? 'text-purple-400 font-medium' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Library Items */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-2'}>
        {filteredItems.map((item) => (
          viewMode === 'grid' ? (
            <div
              key={item.id}
              className="bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group"
              onClick={() => playItem(item)}
            >
              <div className="relative mb-4">
                {item.gradient ? (
                  <div className={`w-full aspect-square rounded-md bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                    <span className="text-white text-2xl">♥</span>
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full aspect-square object-cover ${item.type === 'artist' ? 'rounded-full' : 'rounded-md'}`}
                  />
                )}
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-purple-400">
                  <Play size={16} fill="white" className="text-white ml-0.5" />
                </button>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">{item.name}</h3>
              <p className="text-sm text-neutral-400 truncate">{item.details}</p>
            </div>
          ) : (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-800 cursor-pointer group"
              onClick={() => playItem(item)}
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
                <button className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-colors">
                  <Play size={12} fill="white" className="text-white ml-0.5" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                  <Download size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Library;
