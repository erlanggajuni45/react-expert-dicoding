import React from 'react';
import { CirclePlus, LogIn, LogOut, MessageSquare, Trophy } from 'lucide-react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { asyncUnsetAuthUser } from '../states/authUser/action';
import { toast } from 'sonner';

export default function Navbar() {
  const authUser = useSelector((state) => state.authUser);

  const dispatch = useDispatch();

  const onLogout = () => {
    toast.success('Berhasil logout!');
    dispatch(asyncUnsetAuthUser());
  };

  return (
    <nav className='bg-white/70 border-b border-gray-200 p-4 sticky top-0 z-40 backdrop-blur'>
      <div className='max-w-5xl flex items-center justify-between mx-auto px-4 gap-4'>
        <Link to='/'>
          <div className='flex items-center gap-4 cursor-pointer'>
            <MessageSquare className='h-5 w-5 text-indigo-600' />
            <h1 className='text-lg font-bold'>Diskusi</h1>
          </div>
        </Link>
        <div className='flex items-center gap-4'>
          <Link
            to='/leaderboard'
            className='flex items-center gap-2'
          >
            <Trophy className='h-4 w-4' /> <span className='hidden md:inline'>Leaderboard</span>
          </Link>
          {authUser ? (
            <>
              <Link to='/threads/new'>
                <button className='cursor-pointer bg-black text-white rounded-md py-2 px-2.5 flex items-center gap-2'>
                  <CirclePlus className='h-4 w-4' />{' '}
                  <span className='hidden md:inline'>Thread Baru</span>
                </button>
              </Link>

              <img
                src={authUser.avatar}
                alt={authUser.name}
                className='h-8 w-8 rounded-full'
              />

              <button onClick={onLogout}>
                <LogOut className='h-5 w-5 cursor-pointer' />
              </button>
            </>
          ) : (
            <Link to='/login'>
              <button className='flex items-center gap-2 border border-gray-200 rounded px-2 py-1 text-sm hover:bg-gray-100 transition-colors cursor-pointer'>
                <LogIn className='h-4 w-4' /> Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
