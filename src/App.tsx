import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MiniPlayer from "./components/MiniPlayer";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { useIsMobile } from "./hooks/use-mobile";
import SplashScreen from "./components/SplashScreen";
import { useState, useEffect } from "react";

const AuthGate = () => {
  const isMobile = useIsMobile();
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) {
    return <SplashScreen />;
  }

  return isAuthenticated ? (
    <div className="w-full min-h-screen bg-spotify-black flex flex-col">
      <div className="flex flex-1 min-h-0">
        {!isMobile && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-0">
          <TopBar />
          <main className="flex-1 min-h-0 overflow-y-auto">
            <Routes>
              <Route path="/*" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/404" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
      <MiniPlayer />
      {/* {isMobile && <BottomNav />} */}
    </div>
  ) : (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

const App = () => {
  const queryClient = new QueryClient();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PlayerProvider>
              <AuthProvider>
                <>
                  <MiniPlayer />
                  <AuthGate />
                </>
              </AuthProvider>
            </PlayerProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
