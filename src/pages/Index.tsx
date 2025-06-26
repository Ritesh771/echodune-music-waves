import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Search from '../components/Search';
import Library from '../components/Library';
import NowPlaying from '../components/NowPlaying';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import LikedSongs from '../components/LikedSongs';
import { PlayerProvider } from '../contexts/PlayerContext';

const Index = () => {
  return (
    <PlayerProvider>
      <div className="h-screen bg-black text-white overflow-hidden">
        <Routes>
          <Route path="/now-playing" element={<NowPlaying />} />
          <Route path="*" element={
            <main className="flex-1 overflow-auto bg-gradient-to-b from-neutral-900 to-black">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/liked-songs" element={<LikedSongs />} />
              </Routes>
            </main>
          } />
        </Routes>
      </div>
    </PlayerProvider>
  );
};

export default Index;
