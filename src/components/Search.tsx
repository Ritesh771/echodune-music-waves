
import { useState } from 'react';
import { Search as SearchIcon, Play } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
            className="w-full bg-neutral-800 text-white placeholder-neutral-400 pl-10 pr-4 py-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-neutral-700"
          />
        </div>
      </div>

      {!searchQuery ? (
        <>
          {/* Recent Searches */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Recent searches</h2>
            <div className="space-y-2">
              {recentSearches.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-800 cursor-pointer group">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-neutral-400">{item.type}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-all">
                    <Play size={12} fill="black" className="text-black ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Browse Categories */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Browse all</h2>
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
      ) : (
        <div className="text-center text-neutral-400 mt-16">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>Search for artists, songs, podcasts, and more</p>
        </div>
      )}
    </div>
  );
};

export default Search;
