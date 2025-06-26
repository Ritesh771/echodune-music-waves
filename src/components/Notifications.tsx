
import { Bell, Music, Heart, UserPlus, Download } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: '1',
      type: 'new_release',
      title: 'New release from The Weeknd',
      message: 'After Hours (Deluxe) is now available',
      time: '2 hours ago',
      icon: Music,
      unread: true
    },
    {
      id: '2',
      type: 'like',
      title: 'Someone liked your playlist',
      message: 'John Doe liked "My Chill Mix"',
      time: '4 hours ago',
      icon: Heart,
      unread: true
    },
    {
      id: '3',
      type: 'follow',
      title: 'New follower',
      message: 'Sarah Johnson started following you',
      time: '1 day ago',
      icon: UserPlus,
      unread: false
    },
    {
      id: '4',
      type: 'download',
      title: 'Download complete',
      message: 'Album "Future Nostalgia" is ready offline',
      time: '2 days ago',
      icon: Download,
      unread: false
    },
  ];

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="text-sm text-green-500 hover:text-green-400">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer ${
              notification.unread ? 'bg-neutral-900' : 'bg-transparent'
            }`}
          >
            <div className={`p-2 rounded-full ${
              notification.unread ? 'bg-green-500' : 'bg-neutral-700'
            }`}>
              <notification.icon size={16} className="text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{notification.title}</h3>
                {notification.unread && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <p className="text-sm text-neutral-400 mt-1">{notification.message}</p>
              <p className="text-xs text-neutral-500 mt-2">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell size={48} className="text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-400">No notifications</h3>
          <p className="text-sm text-neutral-500">We'll let you know when something happens</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
