import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  prompt: string;
  scope: string;
  token_type: string;
}

const waveVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      repeatType: "loop" as const,
      duration: 2,
      ease: "easeInOut" as const,
    },
  },
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLoginSuccess = async (tokenResponse: Omit<GoogleTokenResponse, 'error' | 'error_description' | 'error_uri'>) => {
    try {
      const accessToken = tokenResponse.access_token;
      const response = await fetch(`${API_BASE_URL}/api/auth/google-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.access, data.refresh);
      } else {
        setError('Google login failed');
      }
    } catch (err) {
      setError('An error occurred during Google login.');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      setError('Google login failed');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.access, data.refresh);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to login');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-spotify-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-spotify-gray rounded-2xl shadow-2xl border border-spotify-dark/40">
        <div className="flex flex-col items-center mb-6">
          <motion.img
            src="/lovable-uploads/8a136392-25ae-486d-87dc-6f4f1494fc99.png"
            alt="EchoDune Logo"
            className="w-20 h-20 mb-2 drop-shadow-lg"
            variants={waveVariants}
            animate="animate"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-3xl font-bold text-white font-spotify tracking-wide mb-2"
          >
            EchoDune
          </motion.h1>
          <span className="text-spotify-green font-semibold tracking-wider text-lg">Music for Everyone</span>
        </div>
        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div>
            <label htmlFor="username" className="text-sm font-medium text-spotify-lightgray">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-spotify-dark border border-spotify-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-spotify-lightgray">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-spotify-dark border border-spotify-gray rounded-md focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-spotify-green transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-spotify-green rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green transition"
            >
              Sign in
            </motion.button>
          </div>
        </motion.form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-spotify-dark" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-spotify-lightgray bg-spotify-gray">Or continue with</span>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => googleLogin()}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-[#4285F4] rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] flex items-center justify-center gap-2 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.44 1.22 8.44 3.22l6.28-6.28C34.64 2.64 29.74 0 24 0 14.82 0 6.88 5.48 2.88 13.44l7.36 5.72C12.18 13.18 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.14-3.22-.4-4.72H24v9.02h12.44c-.54 2.92-2.18 5.38-4.64 7.06l7.36 5.72C43.12 37.12 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.24 28.22c-1.04-3.12-1.04-6.5 0-9.62l-7.36-5.72C.34 16.36 0 20.12 0 24c0 3.88.34 7.64 2.88 11.12l7.36-5.72z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.14 15.92-5.86l-7.36-5.72c-2.04 1.38-4.64 2.18-8.56 2.18-6.38 0-11.82-3.68-13.76-8.98l-7.36 5.72C6.88 42.52 14.82 48 24 48z"/></g></svg>
          Sign in with Google
        </motion.button>
        <div className="text-center mt-4">
          <span className="text-spotify-lightgray">Don't have an account? </span>
          <button className="text-spotify-green hover:underline" onClick={() => navigate('/register')}>Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default Login; 