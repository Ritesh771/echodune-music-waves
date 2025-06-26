
import { Play, Heart, Shuffle, Clock, TrendingUp, Music } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const Home = () => {
  const { setCurrentTrack, togglePlay } = usePlayer();

  const recentlyPlayed = [
    { id: '1', title: 'Liked Songs', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { id: '2', title: 'Discover Weekly', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
    { id: '3', title: 'Release Radar', cover: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { id: '4', title: 'Daily Mix 1', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop' },
    { id: '5', title: 'Chill Hits', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
    { id: '6', title: 'Rock Classics', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
  ];

  const madeForYou = [
    { id: '1', title: 'Discover Weekly', subtitle: 'Your weekly mixtape of fresh music', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
    { id: '2', title: 'Release Radar', subtitle: 'Catch all the latest music from artists you follow', cover: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { id: '3', title: 'Daily Mix 1', subtitle: 'Post Malone, The Weeknd, Travis Scott and more', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop' },
    { id: '4', title: 'Purple Vibes', subtitle: 'Electronic beats and synth waves', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
  ];

  const topCharts = [
    { id: '1', title: 'Global Top 50', subtitle: 'The most played songs right now', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { id: '2', title: 'Viral 50', subtitle: 'The most viral tracks on Echodune', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
    { id: '3', title: 'New Music Friday', subtitle: 'The best new releases this week', cover: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
  ];

  const playTrack = (track: any) => {
    setCurrentTrack({
      id: track.id,
      title: track.title,
      artist: 'Various Artists',
      album: track.title,
      duration: '3:45',
      cover: track.cover,
    });
    togglePlay();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-6 pb-32">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {getGreeting()}
        </h1>
        
        {/* Quick Actions */}
        <div className="flex items-center space-x-4 mb-6">
          <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
            <Shuffle size={20} />
            <span>Shuffle Play</span>
          </button>
          <button className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            <Heart size={20} />
            <span>Liked Songs</span>
          </button>
        </div>
      </div>

      {/* Recently Played Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {recentlyPlayed.map((item) => (
          <div
            key={item.id}
            className="bg-neutral-800 bg-opacity-50 hover:bg-opacity-70 rounded-md flex items-center transition-all cursor-pointer group transform hover:scale-105"
            onClick={() => playTrack(item)}
          >
            <img src={item.cover} alt={item.title} className="w-16 h-16 rounded-l-md object-cover" />
            <div className="flex-1 px-4">
              <p className="font-semibold text-white truncate">{item.title}</p>
            </div>
            <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center hover:from-purple-500 hover:to-purple-400 transition-all transform hover:scale-110">
                <Play size={16} fill="white" className="text-white ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Made for You Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Music size={24} className="mr-2 text-purple-400" />
            Made for You
          </h2>
          <button className="text-sm text-neutral-400 hover:text-white transition-colors">Show all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {madeForYou.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group transform hover:scale-105"
              onClick={() => playTrack(item)}
            >
              <div className="relative mb-4">
                <img src={item.cover} alt={item.title} className="w-full aspect-square object-cover rounded-md" />
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-purple-500 hover:to-purple-400">
                  <Play size={16} fill="white" className="text-white ml-1" />
                </button>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">{item.title}</h3>
              <p className="text-sm text-neutral-400 line-clamp-2">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Charts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TrendingUp size={24} className="mr-2 text-purple-400" />
            Top Charts
          </h2>
          <button className="text-sm text-neutral-400 hover:text-white transition-colors">Show all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCharts.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group transform hover:scale-105"
              onClick={() => playTrack(item)}
            >
              <div className="relative mb-4">
                <img src={item.cover} alt={item.title} className="w-full aspect-square object-cover rounded-md" />
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-purple-500 hover:to-purple-400">
                  <Play size={16} fill="white" className="text-white ml-1" />
                </button>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">{item.title}</h3>
              <p className="text-sm text-neutral-400 line-clamp-2">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Played Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Clock size={24} className="mr-2 text-purple-400" />
            Jump back in
          </h2>
          <button className="text-sm text-neutral-400 hover:text-white transition-colors">Show all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentlyPlayed.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group transform hover:scale-105"
              onClick={() => playTrack(item)}
            >
              <div className="relative mb-4">
                <img src={item.cover} alt={item.title} className="w-full aspect-square object-cover rounded-md" />
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-purple-500 hover:to-purple-400">
                  <Play size={16} fill="white" className="text-white ml-1" />
                </button>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">{item.title}</h3>
              <p className="text-sm text-neutral-400">Playlist</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
