import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

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
  queue: Track[];
  playTrack: (track: Track, newQueue?: Track[], index?: number) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
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
  // --- Persistent State Initialization ---
  const getPersistedState = () => {
    try {
      const data = localStorage.getItem('playerState');
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  };
  const persisted = getPersistedState();

  const [queue, setQueueState] = useState<Track[]>(persisted?.queue || []);
  const [currentIndex, setCurrentIndex] = useState<number>(typeof persisted?.currentIndex === 'number' ? persisted.currentIndex : -1);
  const [currentTrack, setCurrentTrackState] = useState<Track | null>(persisted?.currentTrack || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [volume, setVolume] = useState(typeof persisted?.volume === 'number' ? persisted.volume : 75);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(typeof persisted?.currentTime === 'number' ? persisted.currentTime : 0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Persist State on Change ---
  useEffect(() => {
    const state = {
      queue,
      currentIndex,
      currentTrack,
      isPlaying,
      currentTime,
      volume,
    };
    localStorage.setItem('playerState', JSON.stringify(state));
  }, [queue, currentIndex, currentTrack, isPlaying, currentTime, volume]);

  // --- Restore currentTime after audio loads ---
  useEffect(() => {
    if (audioRef.current && typeof currentTime === 'number' && currentTime > 0) {
      audioRef.current.currentTime = currentTime;
    }
  }, [audioRef, currentTrack]);

  useEffect(() => {
    console.log('PlayerProvider: currentTrack changed:', currentTrack);
  }, [currentTrack]);

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

  const playTrack = (track: Track, newQueue?: Track[], index?: number) => {
    setCurrentTrack(track, newQueue, index);
    setIsPlaying(true);
  };

  // --- Audio control functions ---
  const play = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };
  const pause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  const setAudioVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  };

  // --- Audio event handlers ---
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
    }
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };
  const handleEnded = () => {
    nextTrack();
  };

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // Sync track src
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.file;
      audioRef.current.load();
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

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
      togglePlay: () => (isPlaying ? pause() : play()),
      toggleShuffle,
      toggleRepeat,
      setVolume: setAudioVolume,
      setProgress,
      setCurrentTime: seek,
      setDuration,
      nextTrack,
      prevTrack,
      queue,
      playTrack,
      play,
      pause,
      seek,
    }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        autoPlay={isPlaying}
      />
    </PlayerContext.Provider>
  );
};
