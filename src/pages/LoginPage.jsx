import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetAuthUser } from '../states/authUser/action';

export default function LoginPage() {
  const isLoading = useSelector((state) => state.ui.loadingCount > 0);
  const authUser = useSelector((state) => state.authUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  useEffect(() => {
    if (authUser) navigate('/');
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert('Email tidak boleh kosong!');
      return;
    }

    if (!password) {
      alert('Password tidak boleh kosong!');
      return;
    }

    if (password.length < 6) {
      alert('Password minimal memiliki 6 karakter!');
      return;
    }

    try {
      await dispatch(asyncSetAuthUser({ email, password }));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 h-screen'>
      <div className='bg-white rounded-lg shadow-md p-8 w-full max-w-md'>
        <h1 className='font-semibold text-2xl'>Selamat datang kembali</h1>
        <p className='text-gray-500 text-sm py-1'>Masuk untuk ikut berdiskusi</p>

        <form
          className='flex flex-col gap-2 mt-4'
          onSubmit={onSubmit}
        >
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={email}
            onChange={onEmailChange}
          />
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={password}
            onChange={onPasswordChange}
          />
          <button
            type='submit'
            className='cursor-pointer bg-black text-white py-2 px-4 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={isLoading}
          >
            Masuk
          </button>
        </form>
        <p className='text-sm text-gray-500 mt-4'>
          Belum punya akun?{' '}
          <Link
            to='/register'
            className='text-blue-500 hover:underline'
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
