import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from 'sonner';
import LoadingBar from './components/LoadingBar';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPreloadProcess } from './states/isPreload/action';
import HomePage from './pages/HomePage';
import AddThreadPage from './pages/AddThreadPage';
import DetailThreadPage from './pages/DetailThreadPage';
import LeaderboardsPage from './pages/LeaderboardsPage';

function App() {
  const isPreload = useSelector((state) => state.isPreload);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  return (
    <div className='bg-zinc-50 text-zinc-900 min-h-screen'>
      <LoadingBar />

      {!isPreload && (
        <>
          <Navbar />

          <Routes>
            <Route
              path='/'
              element={<HomePage />}
            />
            <Route
              path='/login'
              element={<LoginPage />}
            />
            <Route
              path='/register'
              element={<RegisterPage />}
            />
            <Route
              path='/threads/new'
              element={<AddThreadPage />}
            />
            <Route
              path='/threads/:threadId'
              element={<DetailThreadPage />}
            />
            <Route
              path='/leaderboard'
              element={<LeaderboardsPage />}
            />
          </Routes>
        </>
      )}
      <Toaster
        position='top-right'
        richColors
      />
    </div>
  );
}

export default App;
