import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from 'sonner';
import LoadingBar from './components/LoadingBar';

function App() {
  return (
    <div className='bg-zinc-50 text-zinc-900 min-h-screen'>
      <LoadingBar />
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<h1>Home</h1>}
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
