
import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, Shuffle, Repeat } from 'lucide-react';
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

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4">
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div 
          className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0"
          onClick={() => navigate('/now-playing')}
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-14 h-14 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white truncate">{currentTrack.title}</p>
            <p className="text-sm text-neutral-400 truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 ${isLiked ? 'text-green-500' : 'text-neutral-400 hover:text-white'} transition-colors`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 ${isShuffled ? 'text-green-500' : 'text-neutral-400 hover:text-white'} transition-colors`}
            >
              <Shuffle size={16} />
            </button>
            
            <button
              onClick={prevTrack}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <SkipBack size={16} />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={16} className="text-black" />
              ) : (
                <Play size={16} className="text-black ml-0.5" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <SkipForward size={16} />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={`p-2 ${isRepeating ? 'text-green-500' : 'text-neutral-400 hover:text-white'} transition-colors`}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-neutral-400">1:23</span>
            <div className="flex-1 bg-neutral-600 h-1 rounded-full">
              <div 
                className="bg-white h-1 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-neutral-400">{currentTrack.duration}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Volume2 size={16} className="text-neutral-400" />
          <div className="w-24 bg-neutral-600 h-1 rounded-full">
            <div 
              className="bg-white h-1 rounded-full"
              style={{ width: `${volume}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
