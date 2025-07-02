import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, Shuffle, Repeat, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';
import { useLikedSongs } from '../hooks/use-liked-songs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';
import AddToPlaylistDialog from './ui/AddToPlaylistDialog';

const MiniPlayer = () => {
  // All hooks must be at the top
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const navigate = useNavigate();
  const [showAddToPlaylistDialog, setShowAddToPlaylistDialog] = useState(false);

  const {
    currentTrack,
    isPlaying,
    isShuffled,
    isRepeating,
    volume,
    progress,
    currentTime,
    duration,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    setProgress,
    setCurrentTime,
    setDuration,
    nextTrack,
    prevTrack,
    seek,
  } = usePlayer();

  const { isLiked, likeSong, unlikeSong, liking, unliking } = useLikedSongs();

  // Debug log
  console.log('MiniPlayer rendered. currentTrack:', currentTrack);
  if (currentTrack) {
    console.log('MiniPlayer audio src:', currentTrack.file);
  }

  // --- Drag-to-seek logic ---
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerMove = (e: PointerEvent) => handleSeek(e);
  const handlePointerUp = (e: PointerEvent) => handleSeekEnd(e);

  const handleSeekStart = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleSeek = useCallback((e: PointerEvent | React.PointerEvent<HTMLDivElement>) => {
    const bar = document.getElementById('miniplayer-progress-bar');
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const clientX = (e as PointerEvent).clientX !== undefined ? (e as PointerEvent).clientX : (e as React.PointerEvent).clientX;
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    const newTime = percent * (duration || 0);
    // Live scrubbing: update audio playback position in real time
    if (duration > 0) {
      seek(newTime);
    }
  }, [duration, seek]);

  const handleSeekEnd = useCallback((e: PointerEvent) => {
    setIsDragging(false);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Always show currentTime and duration from context
  const displayTime = currentTime;
  const displayDuration = duration;
  const displayProgress = (currentTime / (duration || 1)) * 100;

  if (!currentTrack) return null;

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setVolume(Math.max(0, Math.min(100, percent)));
  };

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
            onClick={e => {
              e.stopPropagation();
              if (!currentTrack) return;
              if (isLiked(Number(currentTrack.id))) {
                unlikeSong(Number(currentTrack.id));
              } else {
                likeSong(Number(currentTrack.id));
              }
            }}
            className={`p-2 transition-all ${isLiked(Number(currentTrack.id)) ? 'text-purple-500 scale-110' : 'text-neutral-400 hover:text-white hover:scale-110'}`}
            disabled={liking || unliking}
          >
            <Heart size={16} fill={isLiked(Number(currentTrack.id)) ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={e => e.stopPropagation()}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span><MoreHorizontal size={16} /></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowAddToPlaylistDialog(true)}>Add to Playlist</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Go to Artist')}>Go to Artist</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Go to Album')}>Go to Album</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert('Share')}>Share</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              onClick={() => {
                console.log('Play/Pause clicked. isPlaying before:', isPlaying);
                togglePlay();
              }}
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
            <span className="text-xs text-neutral-400">{formatTime(displayTime)}</span>
            <div 
              id="miniplayer-progress-bar"
              className="flex-1 bg-neutral-600 h-1 rounded-full cursor-pointer group"
              onPointerDown={handleSeekStart}
            >
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full relative group-hover:from-purple-400 group-hover:to-purple-300 transition-all"
                style={{ width: `${displayProgress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs text-neutral-400">{formatTime(displayDuration)}</span>
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
      <AddToPlaylistDialog
        open={showAddToPlaylistDialog}
        songId={Number(currentTrack.id)}
        onClose={() => setShowAddToPlaylistDialog(false)}
      />
    </div>
  );
};

export default MiniPlayer;
