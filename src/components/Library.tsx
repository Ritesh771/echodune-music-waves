import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import SongList, { Song } from './SongList';
import { useState } from 'react';

const Skeleton = () => (
  <div className="animate-pulse bg-neutral-800 rounded-lg h-64 w-full" />
);

const Library = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['songs', page],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/auth/songs/?page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch songs');
      return res.json();
    },
    });

  return (
    <div className="p-6 pb-32">
      <h1 className="text-2xl font-bold text-white mb-6">Your Library</h1>
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      )}
      {error && (
        <div className="text-red-500 mb-6">
          Failed to load songs. <button className="underline" onClick={() => refetch()}>Retry</button>
      </div>
      )}
      {data && (
        <>
          <SongList songs={data.results} />
          <div className="flex justify-center items-center mt-8 space-x-4">
          <button
              className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >Prev</button>
            <span className="text-white">Page {page}</span>
          <button 
              className="px-4 py-2 rounded bg-neutral-700 text-white hover:bg-neutral-600"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.next}
            >Next</button>
      </div>
        </>
      )}
    </div>
  );
};

export default Library;
