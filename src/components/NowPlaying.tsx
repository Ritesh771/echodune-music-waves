import { useState } from 'react';
import { ChevronDown, MoreHorizontal, Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, Share, Plus, Mic2 } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';
import Queue from './Queue';

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
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentTrack) {
    navigate('/');
    return null;
  }

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

  const lyrics = [
    "I've been trying to call",
    "I've been on my own for long enough",
    "Maybe you can show me how to love, maybe",
    "I don't know what I'm supposed to do",
    "Haunted by the ghost of you",
    "Oh, take me back to the night we met",
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-neutral-900 to-black z-50 overflow-hidden">
      {/* Background Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl"
        style={{ backgroundImage: `url(${currentTrack.cover})` }}
      />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
          >
            <ChevronDown size={24} />
          </button>
          
          <div className="text-center">
            <p className="text-xs text-neutral-400 uppercase tracking-wider">Playing from playlist</p>
            <p className="text-sm font-medium text-white">Liked Songs</p>
          </div>
          
          <button className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all">
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm aspect-square relative">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Track Info */}
        <div className="px-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white truncate mb-2">
                {currentTrack.title}
              </h1>
              <p className="text-lg text-neutral-300 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full transition-all ${isLiked ? 'text-purple-400 bg-purple-400 bg-opacity-20' : 'text-neutral-400 hover:text-white hover:bg-white hover:bg-opacity-10'}`}
              >
                <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button className="p-3 text-neutral-400 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all">
                <Share size={24} />
              </button>
              <button className="p-3 text-neutral-400 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all">
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 mb-6">
          <div className="mb-2">
            <div 
              className="bg-neutral-600 h-1 rounded-full cursor-pointer group"
              onClick={handleProgressChange}
            >
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full relative group-hover:from-purple-400 group-hover:to-purple-300 transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-neutral-400">
            <span>1:23</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={toggleShuffle}
              className={`p-3 rounded-full transition-all ${isShuffled ? 'text-purple-400 bg-purple-400 bg-opacity-20' : 'text-neutral-400 hover:text-white hover:bg-white hover:bg-opacity-10'}`}
            >
              <Shuffle size={24} />
            </button>
            
            <button
              onClick={prevTrack}
              className="p-3 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all hover:scale-110"
            >
              <SkipBack size={32} />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center hover:from-purple-500 hover:to-purple-400 hover:scale-110 transition-all shadow-xl"
            >
              {isPlaying ? (
                <Pause size={24} className="text-white" />
              ) : (
                <Play size={24} className="text-white ml-1" />
              )}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-3 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all hover:scale-110"
            >
              <SkipForward size={32} />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={`p-3 rounded-full transition-all ${isRepeating ? 'text-purple-400 bg-purple-400 bg-opacity-20' : 'text-neutral-400 hover:text-white hover:bg-white hover:bg-opacity-10'}`}
            >
              <Repeat size={24} />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className={`p-2 rounded-full transition-all ${showLyrics ? 'text-purple-400 bg-purple-400 bg-opacity-20' : 'text-neutral-400 hover:text-white hover:bg-white hover:bg-opacity-10'}`}
            >
              <Mic2 size={20} />
            </button>
            <button
              onClick={() => setShowQueue(true)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 7h20v2H2V7zm0 4h20v2H2v-2zm4 4h16v2H6v-2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="px-6 pb-6">
          <div className="flex items-center space-x-3">
            <Volume2 size={20} className="text-neutral-400" />
            <div 
              className="flex-1 bg-neutral-600 h-1 rounded-full cursor-pointer group"
              onClick={handleVolumeChange}
            >
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full relative group-hover:from-purple-400 group-hover:to-purple-300 transition-all"
                style={{ width: `${volume}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lyrics Panel */}
        {showLyrics && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-bold text-white mb-6">Lyrics</h3>
              <div className="space-y-4">
                {lyrics.map((line, index) => (
                  <p key={index} className="text-lg text-neutral-300 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setShowLyrics(false)}
                className="mt-8 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors"
              >
                Close Lyrics
              </button>
            </div>
          </div>
        )}

        {/* Queue Modal */}
        <Queue open={showQueue} onOpenChange={setShowQueue} />
      </div>
    </div>
  );
};

export default NowPlaying;
