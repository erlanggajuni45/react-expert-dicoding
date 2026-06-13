import React, { useEffect } from 'react';

import useInput from '../hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { asyncRegisterUser } from '../states/users/action';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function RegisterPage() {
  const isLoading = useSelector((state) => state.ui.loadingCount > 0);
  const authUser = useSelector((state) => state.authUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, onNameChange] = useInput();
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();

  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(asyncRegisterUser({ name, email, password }));
      toast.success('Registrasi berhasil');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 h-screen'>
      <div className='bg-white rounded-lg shadow-md p-8 w-full max-w-md'>
        <h1 className='font-semibold text-2xl'>Buat akun baru</h1>
        <p className='text-gray-500 text-sm py-1'>Bergabunglah dengan komunitas diskusi.</p>

        <form
          className='flex flex-col gap-2 mt-4'
          onSubmit={onSubmit}
        >
          <label htmlFor='name'>Nama</label>
          <input
            type='text'
            id='name'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={name}
            onChange={onNameChange}
          />
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
            className='border border-gray-300 rounded-md py-2 px-3
            focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={password}
            onChange={onPasswordChange}
          />
          <button
            type='submit'
            className='cursor-pointer bg-black text-white py-2 px-4 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-500'
            disabled={isLoading}
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
