import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetLeaderboards } from '../states/leaderboard/action';
import Skeleton from 'react-loading-skeleton';
import { Trophy } from 'lucide-react';

export default function LeaderboardsPage() {
  const leaderboards = useSelector((state) => state.leaderboards);
  const isLoading = useSelector((state) => state.ui.loadingCount > 0);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        dispatch(asyncGetLeaderboards());
      } catch (err) {
        alert(err.message);
      }
    })();
  }, [dispatch]);

  return (
    <div className='max-w-3xl px-4 py-8 mx-auto'>
      {isLoading ? (
        <Skeleton
          count={5}
          height={30}
        />
      ) : !leaderboards.length && !isLoading ? (
        <h1>Data tidak ada</h1>
      ) : (
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Trophy className='text-yellow-500' />{' '}
            <h3 className='font-bold text-xl'>Leaderboard</h3>
          </div>
          <span className='text-sm text-slate-500'>Pengguna paling aktif di komunitas.</span>

          {leaderboards.map((l, idx) => (
            <div
              key={l.user.id}
              className='flex gap-3 bg-white rounded-xl border border-gray-200 items-center p-2'
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                  idx === 0
                    ? 'bg-amber-100 text-amber-700'
                    : idx === 1
                      ? 'bg-zinc-100 text-zinc-700'
                      : idx === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-zinc-50 text-zinc-500'
                }`}
              >
                {idx + 1}
              </div>
              <img
                className='w-8 h-8 rounded-full'
                src={l.user.avatar}
                alt={l.user.name}
              />
              <span>{l.user.name}</span>
              <span className='ml-auto text-indigo-700'>{l.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
