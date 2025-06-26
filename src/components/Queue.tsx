import { usePlayer } from '../contexts/PlayerContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from './ui/sheet';
import { Play } from 'lucide-react';

interface QueueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Queue = ({ open, onOpenChange }: QueueProps) => {
  const {
    currentTrack,
    setCurrentTrack,
    queue = [],
  } = usePlayer();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[70vh] overflow-y-auto bg-neutral-900 text-white p-0">
        <SheetHeader className="sticky top-0 z-10 bg-neutral-900 p-6 border-b border-neutral-800">
          <SheetTitle>Queue</SheetTitle>
        </SheetHeader>
        <div className="divide-y divide-neutral-800">
          {queue.length === 0 && (
            <div className="p-8 text-center text-neutral-400">Queue is empty</div>
          )}
          {queue.map((track, idx) => (
            <button
              key={track.id}
              className={`w-full flex items-center px-6 py-4 text-left transition-all ${currentTrack?.id === track.id ? 'bg-spotify-green/10 text-spotify-green font-bold' : 'hover:bg-neutral-800'}`}
              onClick={() => setCurrentTrack(track, queue, idx)}
            >
              <div className="flex-shrink-0 w-12 h-12 mr-4">
                <img src={track.cover} alt={track.title} className="w-12 h-12 object-cover rounded" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-lg">{track.title}</div>
                <div className="truncate text-sm text-neutral-400">{track.artist}</div>
              </div>
              {currentTrack?.id === track.id && <Play size={20} className="ml-4 text-spotify-green animate-pulse" />}
            </button>
          ))}
        </div>
        <SheetClose asChild>
          <button className="w-full py-4 text-center text-neutral-400 hover:text-white border-t border-neutral-800 bg-neutral-900">Close</button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default Queue; 