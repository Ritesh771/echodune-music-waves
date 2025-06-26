
import { useState } from 'react';
import { Heart, Play, Download, MoreHorizontal, Clock } from 'lucide-react';

const LikedSongs = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const likedSongs = [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:20',
      dateAdded: '5 days ago',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: '2:54',
      dateAdded: '1 week ago',
      cover: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=300&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: '3:23',
      dateAdded: '2 weeks ago',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
    },
  ];

  return (
    <div className="text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-800 to-black p-6">
        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-gradient-to-br from-purple-400 to-blue-600 rounded flex items-center justify-center">
            <Heart size={80} fill="white" className="text-white" />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">PLAYLIST</p>
            <h1 className="text-5xl font-bold mb-4">Liked Songs</h1>
            <p className="text-neutral-300">{likedSongs.length} songs</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-b from-black/40 to-black p-6">
        <div className="flex items-center space-x-6 mb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Play size={20} className="text-black ml-1" />
          </button>
          
          <button className="text-neutral-400 hover:text-white transition-colors">
            <Download size={24} />
          </button>
          
          <button className="text-neutral-400 hover:text-white transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Song List Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-neutral-400 border-b border-neutral-700 mb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-5">TITLE</div>
          <div className="col-span-3">ALBUM</div>
          <div className="col-span-2">DATE ADDED</div>
          <div className="col-span-1">
            <Clock size={16} />
          </div>
        </div>

        {/* Song List */}
        <div className="space-y-1">
          {likedSongs.map((song, index) => (
            <div
              key={song.id}
              className="grid grid-cols-12 gap-4 px-4 py-2 rounded hover:bg-neutral-800 transition-colors group cursor-pointer"
            >
              <div className="col-span-1 flex items-center">
                <span className="text-neutral-400 group-hover:hidden">{index + 1}</span>
                <Play size={16} className="text-white hidden group-hover:block" />
              </div>
              
              <div className="col-span-5 flex items-center space-x-3">
                <img src={song.cover} alt={song.title} className="w-10 h-10 rounded" />
                <div>
                  <p className="text-white font-medium">{song.title}</p>
                  <p className="text-sm text-neutral-400">{song.artist}</p>
                </div>
              </div>
              
              <div className="col-span-3 flex items-center">
                <span className="text-neutral-400 text-sm">{song.album}</span>
              </div>
              
              <div className="col-span-2 flex items-center">
                <span className="text-neutral-400 text-sm">{song.dateAdded}</span>
              </div>
              
              <div className="col-span-1 flex items-center justify-between">
                <Heart size={16} className="text-green-500 fill-current opacity-0 group-hover:opacity-100" />
                <span className="text-neutral-400 text-sm">{song.duration}</span>
                <MoreHorizontal size={16} className="text-neutral-400 opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;
