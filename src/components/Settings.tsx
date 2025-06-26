import { useState } from 'react';
import { ChevronRight, Volume2, Bell, Lock, Download, Smartphone, Wifi } from 'lucide-react';

const Settings = () => {
  const [streamingQuality, setStreamingQuality] = useState('high');
  const [downloadQuality, setDownloadQuality] = useState('high');
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const settingsSections = [
    {
      title: 'Audio Quality',
      items: [
        {
          label: 'Streaming quality',
          value: streamingQuality,
          options: ['low', 'normal', 'high', 'very high'],
          onChange: setStreamingQuality,
          icon: Volume2
        },
        {
          label: 'Download quality',
          value: downloadQuality,
          options: ['normal', 'high', 'very high'],
          onChange: setDownloadQuality,
          icon: Download
        }
      ]
    },
    {
      title: 'Playback',
      items: [
        {
          label: 'Autoplay',
          type: 'toggle',
          value: autoplay,
          onChange: setAutoplay,
          icon: Volume2
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          label: 'Push notifications',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
          icon: Bell
        }
      ]
    }
  ];

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {settingsSections.map((section) => (
        <div key={section.title} className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-neutral-300">{section.title}</h2>
          
          <div className="space-y-2">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <item.icon size={20} className="text-neutral-400" />
                  <span>{item.label}</span>
                </div>
                
                {item.type === 'toggle' ? (
                  <button
                    onClick={() => item.onChange(!item.value)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      item.value ? 'bg-green-500' : 'bg-neutral-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      item.value ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                ) : (
                  <select
                    value={item.value}
                    onChange={(e) => item.onChange(e.target.value)}
                    className="bg-neutral-700 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {item.options?.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Other Settings */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold mb-4 text-neutral-300">Other</h2>
        
        {[
          { label: 'Privacy', icon: Lock },
          { label: 'Connect devices', icon: Smartphone },
          { label: 'Offline mode', icon: Wifi },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <item.icon size={20} className="text-neutral-400" />
              <span>{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-neutral-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Settings;
