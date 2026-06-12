import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from 'sonner';
import LoadingBar from './components/LoadingBar';
import { useDispatch } from 'react-redux';
import { asyncPreloadProcess } from './states/isPreload/action';
import HomePage from './pages/HomePage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  return (
    <div className='bg-zinc-50 text-zinc-900 min-h-screen'>
      <LoadingBar />
      <Navbar />

      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/leaderboard'
          element={<h1>Leaderboard</h1>}
        />
        <Route
          path='/login'
          element={<LoginPage />}
        />
        <Route
          path='/register'
          element={<RegisterPage />}
        />
      </Routes>
      <Toaster
        position='top-right'
        richColors
      />
    </div>
  );
}

export default App;
