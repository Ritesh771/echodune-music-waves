
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Home from '../components/Home';
import Search from '../components/Search';
import Library from '../components/Library';
import NowPlaying from '../components/NowPlaying';
import MiniPlayer from '../components/MiniPlayer';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
import LikedSongs from '../components/LikedSongs';
import Notifications from '../components/Notifications';
import { PlayerProvider } from '../contexts/PlayerContext';

const Index = () => {
  return (
    <PlayerProvider>
      <div className="h-screen bg-black text-white overflow-hidden">
        <Routes>
          <Route path="/now-playing" element={<NowPlaying />} />
          <Route path="*" element={
            <>
              <div className="flex h-full">
                {/* Sidebar */}
                <Sidebar />
                
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                  <TopBar />
                  
                  <main className="flex-1 overflow-auto bg-gradient-to-b from-neutral-900 to-black">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/liked-songs" element={<LikedSongs />} />
                      <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                  </main>
                </div>
              </div>
              
              {/* Mini Player */}
              <MiniPlayer />
            </>
          } />
        </Routes>
      </div>
    </PlayerProvider>
  );
};

export default Index;
