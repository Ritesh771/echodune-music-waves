
import { useState } from 'react';
import { ChevronDown, MoreHorizontal, Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2 } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';

const NowPlaying = () => {
  const {
    currentTrack,
    isPlaying,
    isShuffled,
    isRepeating,
    volume,
    progress,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    setProgress,
    nextTrack,
    prevTrack,
  } = usePlayer();

  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  if (!currentTrack) {
    navigate('/');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-neutral-800 to-black z-50 overflow-hidden">
      {/* Background Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl"
        style={{ backgroundImage: `url(${currentTrack.cover})` }}
      />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white"
          >
            <ChevronDown size={24} />
          </button>
          
          <div className="text-center">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Playing from playlist</p>
            <p className="text-sm font-medium text-white">Liked Songs</p>
          </div>
          
          <button className="p-2 text-white">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm aspect-square">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Track Info */}
        <div className="px-6 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white truncate mb-1">
                {currentTrack.title}
              </h1>
              <p className="text-lg text-neutral-400 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 ml-4 ${isLiked ? 'text-green-500' : 'text-neutral-400'}`}
            >
              <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 mb-6">
          <div className="mb-2">
            <div className="bg-neutral-600 h-1 rounded-full">
              <div 
                className="bg-white h-1 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-neutral-400">
            <span>1:23</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleShuffle}
              className={`p-3 ${isShuffled ? 'text-green-500' : 'text-neutral-400'}`}
            >
              <Shuffle size={24} />
            </button>
            
            <button
              onClick={prevTrack}
              className="p-3 text-white"
            >
              <SkipBack size={32} />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={24} className="text-black" />
              ) : (
                <Play size={24} className="text-black ml-1" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-3 text-white"
            >
              <SkipForward size={32} />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={`p-3 ${isRepeating ? 'text-green-500' : 'text-neutral-400'}`}
            >
              <Repeat size={24} />
            </button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="px-6 pb-8">
          <div className="flex items-center space-x-3">
            <Volume2 size={20} className="text-neutral-400" />
            <div className="flex-1 bg-neutral-600 h-1 rounded-full">
              <div 
                className="bg-white h-1 rounded-full"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
