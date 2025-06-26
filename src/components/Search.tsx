
import { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Clock, TrendingUp } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useLocation } from 'react-router-dom';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { setCurrentTrack, togglePlay } = usePlayer();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  const categories = [
    { name: 'Pop', color: 'bg-pink-500', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { name: 'Hip-Hop', color: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { name: 'Rock', color: 'bg-red-500', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
    { name: 'Electronic', color: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop' },
    { name: 'Jazz', color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
    { name: 'Classical', color: 'bg-green-500', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { name: 'Country', color: 'bg-yellow-500', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
    { name: 'R&B', color: 'bg-indigo-500', image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
  ];

  const recentSearches = [
    { id: '1', name: 'The Weeknd', type: 'Artist', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { id: '2', name: 'Blinding Lights', type: 'Song', image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { id: '3', name: 'After Hours', type: 'Album', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
  ];

  const searchResults = [
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { id: '2', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration: '3:35', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
    { id: '3', title: 'Can\'t Feel My Face', artist: 'The Weeknd', album: 'Beauty Behind The Madness', duration: '3:35', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
  ];

  const filters = ['all', 'songs', 'artists', 'albums', 'playlists'];

  const playTrack = (track: any) => {
    setCurrentTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      cover: track.image,
    });
    togglePlay();
  };

  return (
    <div className="p-6 pb-32">
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-neutral-800 text-white placeholder-neutral-400 pl-10 pr-4 py-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-neutral-700"
          />
        </div>
      </div>

      {searchQuery ? (
        <>
          {/* Search Filters */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Results */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4 text-neutral-400 text-sm px-4 py-2 border-b border-neutral-800">
              <div className="w-4">#</div>
              <div className="flex-1">TITLE</div>
              <div className="w-20 text-center">
                <Clock size={16} />
              </div>
            </div>
            {searchResults.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center space-x-4 p-2 rounded-md hover:bg-neutral-800 cursor-pointer group"
                onClick={() => playTrack(track)}
              >
                <div className="w-4 text-neutral-400 text-sm">{index + 1}</div>
                <img src={track.image} alt={track.title} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{track.title}</p>
                  <p className="text-sm text-neutral-400 truncate">{track.artist}</p>
                </div>
                <div className="text-sm text-neutral-400">{track.duration}</div>
                <button className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-all">
                  <Play size={12} fill="white" className="text-white ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Recent Searches */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Clock size={20} className="mr-2" />
              Recent searches
            </h2>
            <div className="space-y-2">
              {recentSearches.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-800 cursor-pointer group">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-neutral-400">{item.type}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center hover:bg-purple-400 transition-all">
                    <Play size={12} fill="white" className="text-white ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Browse Categories */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2" />
              Browse all
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`${category.color} relative p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform overflow-hidden`}
                  style={{ minHeight: '120px' }}
                >
                  <h3 className="text-white font-bold text-lg mb-2">{category.name}</h3>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute bottom-0 right-0 w-16 h-16 object-cover rounded-md transform rotate-12 translate-x-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
