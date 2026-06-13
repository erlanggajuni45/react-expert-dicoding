import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

export default function AddThreadPage() {
  const authUser = useSelector((state) => state.authUser);
  const isPreload = useSelector((state) => state.isPreload);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isPreload && !authUser) {
      alert('Anda harus login untuk membuat thread baru!');
      navigate('/login');
    }
  }, [isPreload, authUser, navigate]);

  if (isPreload) {
    return null;
  }

  if (!authUser) {
    return null;
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='font-semibold text-2xl'>Buat Thread Baru</h1>
        <p className='text-gray-500 mt-2'>Mulai percakapan baru di komunitas.</p>
      </div>
      <form className='shadow-md bg-white flex flex-col p-4 border border-slate-300 rounded-xl gap-4'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='title'>Judul</label>
          <input
            type='text'
            name='title'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='category'>Kategori (opsional)</label>
          <input
            type='text'
            name='category'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='content'>Konten</label>
          <textarea
            name='content'
            rows='7'
            className='resize-none border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          ></textarea>
        </div>
        <div className='flex justify-end gap-4'>
          <Link to='/'>
            <button
              type='button'
              className='cursor-pointer p-2'
            >
              Batal
            </button>
          </Link>
          <button className='cursor-pointer px-4 bg-black text-white rounded-md'>Post</button>
        </div>
      </form>
    </div>
  );
}
