import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetThreads } from '../states/threads/action';
import { asyncGetAllUsers } from '../states/users/action';
import Skeleton from 'react-loading-skeleton';
import ThreadCard from '../components/ThreadCard';

export default function HomePage() {
  const isLoading = useSelector((state) => state.ui.loadingCount > 0);
  const threads = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncGetThreads());
    dispatch(asyncGetAllUsers());
  }, [dispatch]);

  const categories = useMemo(
    () => Array.from(new Set(threads.map((threads) => threads.category))),
    [threads],
  );
  const userMap = useMemo(() => Object.fromEntries(users.map((user) => [user.id, user])), [users]);

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='font-semibold text-2xl'>Diskusi Terbaru</h1>
        <p className='text-gray-500'>Bergabunglah dalam percakapan komunitas.</p>
      </div>

      {isLoading ? (
        <div className='flex flex-col gap-2'>
          {[0, 1, 2].map((item) => (
            <Skeleton
              key={item}
              count={5}
            />
          ))}
        </div>
      ) : threads.length === 0 ? (
        <div className='text-center text-zinc-500 py-16'>Tidak ada thread.</div>
      ) : (
        <div className='flex flex-col gap-2'>
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              owner={userMap[thread.ownerId]}
              thread={thread}
            />
          ))}
        </div>
      )}
    </div>
  );
}
