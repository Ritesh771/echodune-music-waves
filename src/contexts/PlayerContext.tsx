
import { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isShuffled: boolean;
  isRepeating: boolean;
  volume: number;
  progress: number;
  setCurrentTrack: (track: Track | null) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
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
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  const toggleRepeat = () => setIsRepeating(!isRepeating);
  const nextTrack = () => console.log('Next track');
  const prevTrack = () => console.log('Previous track');

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      isShuffled,
      isRepeating,
      volume,
      progress,
      setCurrentTrack,
      togglePlay,
      toggleShuffle,
      toggleRepeat,
      setVolume,
      setProgress,
      nextTrack,
      prevTrack,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
