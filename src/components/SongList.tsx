import { Play, Heart as HeartIcon } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { API_BASE_URL } from '../config';

export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  file: string;
  cover_image?: string;
  duration?: number;
}

function getFullUrl(path?: string) {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/media/${path.replace(/^\/+/, '')}`;
}

const SongList = ({ songs, likedSongIds = [], onLikeToggle }: { songs: Song[] | undefined | null; likedSongIds?: number[]; onLikeToggle?: (songId: number) => void }) => {
  const { setCurrentTrack, togglePlay } = usePlayer();

  const playSong = (song: Song) => {
    setCurrentTrack({
      id: String(song.id),
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : '',
      cover: getFullUrl(song.cover_image),
      file: getFullUrl(song.file),
    });
    togglePlay();
  };

  const safeSongs = Array.isArray(songs) ? songs : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeSongs.map((song) => {
        const liked = likedSongIds.includes(song.id);
        return (
          <div
            key={song.id}
            className="bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group transform hover:scale-105"
          >
            <div className="relative mb-4">
              <img
                src={getFullUrl(song.cover_image)}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md"
              />
              <button
                className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-purple-500 hover:to-purple-400"
                onClick={() => playSong(song)}
              >
                <Play size={16} fill="white" className="text-white ml-1" />
              </button>
              {onLikeToggle && (
                <button
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition"
                  onClick={(e) => { e.stopPropagation(); onLikeToggle(song.id); }}
                  aria-label={liked ? 'Unlike' : 'Like'}
                >
                  <HeartIcon size={20} className={liked ? 'text-pink-500 fill-pink-500' : 'text-neutral-400'} fill={liked ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
            <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
            <p className="text-sm text-neutral-400 truncate">{song.artist}{song.album ? ` \u2022 ${song.album}` : ''}</p>
          </div>
        );
      })}
    </div>
  );
};

export default SongList; 