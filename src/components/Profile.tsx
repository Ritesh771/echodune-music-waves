import { useEffect, useState } from 'react';
import { User, Edit, Settings, LogOut, Heart, Music, Users, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../config';

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/media/${path.replace(/^\/+/, '')}`;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setBio(''); // You can add a bio field to your user model if needed
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-6 text-white">Loading profile...</div>;
  if (!user) return <div className="p-6 text-red-500">Failed to load profile.</div>;

  return (
    <div className="p-6 text-white">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center overflow-hidden">
          {user.profile_picture ? (
            <img src={getFullUrl(user.profile_picture)} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
          <User size={48} className="text-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-neutral-400 mb-1">Profile</p>
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={user.username}
                onChange={() => {}}
                className="text-4xl font-bold bg-transparent border-b border-neutral-600 focus:outline-none focus:border-green-500"
                disabled
              />
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="text-neutral-400 bg-transparent border-b border-neutral-600 focus:outline-none focus:border-green-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-green-500 text-black px-4 py-1 rounded-full text-sm font-medium hover:bg-green-400"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border border-neutral-600 text-white px-4 py-1 rounded-full text-sm hover:bg-neutral-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
              <p className="text-neutral-400 mb-2">{user.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-sm text-neutral-400 hover:text-white"
              >
                <Edit size={16} />
                <span>Edit profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats (placeholder, you can fetch real stats if available) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-800 rounded-lg p-4 text-center">
          <Music size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">-</p>
          <p className="text-sm text-neutral-400">Playlists</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-4 text-center">
          <Users size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">-</p>
          <p className="text-sm text-neutral-400">Following</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-4 text-center">
          <Heart size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">-</p>
          <p className="text-sm text-neutral-400">Followers</p>
        </div>
        <div className="bg-neutral-800 rounded-lg p-4 text-center">
          <Calendar size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">-</p>
          <p className="text-sm text-neutral-400">Joined</p>
          </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors">
          <Settings size={20} className="text-neutral-400" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors">
          <Heart size={20} className="text-neutral-400" />
          <span>Liked Songs</span>
        </button>
        <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-800 transition-colors text-red-400">
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
