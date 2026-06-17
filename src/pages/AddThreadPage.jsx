import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import useInput from '../hooks/useInput';
import { asyncAddThread } from '../states/threads/action';
import { toast } from 'sonner';

export default function AddThreadPage() {
  const authUser = useSelector((state) => state.authUser);
  const isPreload = useSelector((state) => state.isPreload);
  const isLoading = useSelector((state) => state.ui.loadingCount > 0);

  const [title, onChangeTitle] = useInput('');
  const [category, onChangeCategory] = useInput('');
  const [body, onChangeBody] = useInput('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPreload && !authUser) {
      toast.warning('Anda harus login untuk membuat thread baru!');
      navigate('/login');
    }
  }, [isPreload, authUser, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(asyncAddThread({ title, body, category }));
      toast.success('Berhasil menambahkan thread!');
      navigate('/');
    } catch (e) {
      toast.error(e.message);
    }
  };

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
      <form
        className='shadow-md bg-white flex flex-col p-4 border border-slate-300 rounded-xl gap-4'
        onSubmit={onSubmit}
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor='title'>Judul</label>
          <input
            type='text'
            name='title'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={title}
            onChange={onChangeTitle}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='category'>Kategori (opsional)</label>
          <input
            type='text'
            name='category'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={category}
            onChange={onChangeCategory}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='content'>Konten</label>
          <textarea
            name='content'
            rows='7'
            className='resize-none border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={onChangeBody}
          >
            {body}
          </textarea>
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
          <button
            className='cursor-pointer px-4 bg-black text-white rounded-md disabled:bg-gray-500'
            disabled={isLoading}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
