
import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, Shuffle, Repeat, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
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
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentTrack) return null;

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, percent)));
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setVolume(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 z-40">
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div 
          className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0 group"
          onClick={() => navigate('/now-playing')}
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-md object-cover group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white truncate group-hover:text-purple-400 transition-colors">
              {currentTrack.title}
            </p>
            <p className="text-sm text-neutral-400 truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 transition-all ${isLiked ? 'text-purple-500 scale-110' : 'text-neutral-400 hover:text-white hover:scale-110'}`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 transition-all ${isShuffled ? 'text-purple-500 scale-110' : 'text-neutral-400 hover:text-white hover:scale-110'}`}
            >
              <Shuffle size={16} />
            </button>
            
            <button
              onClick={prevTrack}
              className="p-2 text-neutral-400 hover:text-white transition-all hover:scale-110"
            >
              <SkipBack size={16} />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center hover:from-purple-500 hover:to-purple-400 hover:scale-110 transition-all"
            >
              {isPlaying ? (
                <Pause size={16} className="text-white" />
              ) : (
                <Play size={16} className="text-white ml-0.5" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-2 text-neutral-400 hover:text-white transition-all hover:scale-110"
            >
              <SkipForward size={16} />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={`p-2 transition-all ${isRepeating ? 'text-purple-500 scale-110' : 'text-neutral-400 hover:text-white hover:scale-110'}`}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-neutral-400">1:23</span>
            <div 
              className="flex-1 bg-neutral-600 h-1 rounded-full cursor-pointer group"
              onClick={handleProgressChange}
            >
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full relative group-hover:from-purple-400 group-hover:to-purple-300 transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs text-neutral-400">{currentTrack.duration}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end relative">
          <button
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Volume2 size={16} />
          </button>
          <div 
            className={`w-24 bg-neutral-600 h-1 rounded-full cursor-pointer group transition-all ${showVolumeSlider ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            onClick={handleVolumeChange}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full relative group-hover:from-purple-400 group-hover:to-purple-300 transition-all"
              style={{ width: `${volume}%` }}
            >
              <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-opacity ${showVolumeSlider ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
