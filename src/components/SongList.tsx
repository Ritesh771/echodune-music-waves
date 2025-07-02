import { Play, Heart as HeartIcon, Pause, Plus, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { API_BASE_URL } from '../config';
import { useLikedSongs } from '../hooks/use-liked-songs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/dropdown-menu';
import AddToPlaylistDialog from './ui/AddToPlaylistDialog';
import { useState } from 'react';

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
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Always prepend API_BASE_URL and ensure single slash
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

const SongList = ({ songs, onAddToPlaylist }: { songs: Song[] | undefined | null; onAddToPlaylist?: (songId: number) => void }) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { isLiked, likeSong, unlikeSong, liking, unliking } = useLikedSongs();
  const [addToPlaylistSongId, setAddToPlaylistSongId] = useState<number | null>(null);

  const playSong = (song: Song) => {
    const track = {
      id: String(song.id),
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration ? `${Math.floor(song.duration / 60)}:${('0' + Math.floor(song.duration % 60)).slice(-2)}` : '',
      cover: getFullUrl(song.cover_image),
      file: getFullUrl(song.file),
    };
    const queue = safeSongs.map(s => ({
      id: String(s.id),
      title: s.title,
      artist: s.artist,
      album: s.album,
      duration: s.duration ? `${Math.floor(s.duration / 60)}:${('0' + Math.floor(s.duration % 60)).slice(-2)}` : '',
      cover: getFullUrl(s.cover_image),
      file: getFullUrl(s.file),
    }));
    const index = safeSongs.findIndex(s => s.id === song.id);
    playTrack(track, queue, index);
  };

  const safeSongs = Array.isArray(songs) ? songs.filter(s => s && typeof s.id !== 'undefined' && typeof s.title !== 'undefined') : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeSongs.map((song) => {
        // Defensive: fallback for cover_image
        const coverImage = song && song.cover_image ? getFullUrl(song.cover_image) : '/placeholder.svg';
        const isCurrent = currentTrack && String(song.id) === currentTrack.id;
        return (
          <div
            key={song.id}
            className={`bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all cursor-pointer group transform hover:scale-105 ${isCurrent ? 'ring-2 ring-spotify-green' : ''}`}
            onClick={() => isCurrent && isPlaying ? togglePlay() : playSong(song)}
          >
            <div className="relative mb-4">
              <img
                src={coverImage}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md"
              />
              <button
                className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center opacity-100 transition-all duration-300 hover:from-purple-500 hover:to-purple-400 z-10"
                onClick={e => { e.stopPropagation(); isCurrent && isPlaying ? togglePlay() : playSong(song); }}
              >
                {isCurrent && isPlaying ? (
                  <Pause size={20} fill="white" className="text-white" />
                ) : (
                  <Play size={20} fill="white" className="text-white" />
                )}
              </button>
              <button
                className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition z-10"
                onClick={e => {
                  e.stopPropagation();
                  if (isLiked(song.id)) {
                    unlikeSong(song.id);
                  } else {
                    likeSong(song.id);
                  }
                }}
                aria-label={isLiked(song.id) ? 'Unlike' : 'Like'}
                disabled={liking || unliking}
              >
                <HeartIcon size={20} className={isLiked(song.id) ? 'text-pink-500 fill-pink-500' : 'text-neutral-400'} fill={isLiked(song.id) ? 'currentColor' : 'none'} />
              </button>
              {onAddToPlaylist && (
                <button
                  className="absolute bottom-2 left-2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition z-10"
                  onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song.id); }}
                  aria-label="Add to Playlist"
                >
                  <Plus size={20} className="text-neutral-400" />
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-black bg-opacity-60 rounded-full hover:bg-opacity-80 transition z-10"
                    onClick={e => e.stopPropagation()}
                    aria-label="More"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setAddToPlaylistSongId(song.id)}>Add to Playlist</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert('Go to Artist')}>Go to Artist</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert('Go to Album')}>Go to Album</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => alert('Share')}>Share</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
            <p className="text-sm text-neutral-400 truncate">{song.artist}{song.album ? ` \u2022 ${song.album}` : ''}</p>
          </div>
        );
      })}
      <AddToPlaylistDialog
        open={addToPlaylistSongId !== null}
        songId={addToPlaylistSongId}
        onClose={() => setAddToPlaylistSongId(null)}
      />
    </div>
  );
};

export default SongList; 