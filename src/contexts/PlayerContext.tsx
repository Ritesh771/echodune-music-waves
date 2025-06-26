import { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  file: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isShuffled: boolean;
  isRepeating: boolean;
  volume: number;
  progress: number;
  currentTime: number;
  duration: number;
  setCurrentTrack: (track: Track | null, queue?: Track[], index?: number) => void;
  setQueue: (queue: Track[], index: number) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueueState] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const setCurrentTrack = (track: Track | null, newQueue?: Track[], index?: number) => {
    if (newQueue && typeof index === 'number') {
      setQueueState(newQueue);
      setCurrentIndex(index);
      setCurrentTrackState(track);
    } else if (track) {
      setCurrentTrackState(track);
      // If the track is in the queue, update index
      const idx = queue.findIndex(t => t.id === track.id);
      if (idx !== -1) setCurrentIndex(idx);
    } else {
      setCurrentTrackState(null);
      setCurrentIndex(-1);
    }
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const setQueue = (newQueue: Track[], index: number) => {
    setQueueState(newQueue);
    setCurrentIndex(index);
    setCurrentTrackState(newQueue[index] || null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };
  
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };
  
  const nextTrack = () => {
    if (queue.length === 0) return;
    let nextIdx = currentIndex + 1;
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length);
    }
    if (nextIdx >= queue.length) {
      if (isRepeating) {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }
    setCurrentIndex(nextIdx);
    setCurrentTrackState(queue[nextIdx]);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };
  
  const prevTrack = () => {
    if (queue.length === 0) return;
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      if (isRepeating) {
        prevIdx = queue.length - 1;
      } else {
        prevIdx = 0;
      }
    }
    setCurrentIndex(prevIdx);
    setCurrentTrackState(queue[prevIdx]);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      isShuffled,
      isRepeating,
      volume,
      progress,
      currentTime,
      duration,
      setCurrentTrack,
      setQueue,
      togglePlay,
      toggleShuffle,
      toggleRepeat,
      setVolume,
      setProgress,
      setCurrentTime,
      setDuration,
      nextTrack,
      prevTrack,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
