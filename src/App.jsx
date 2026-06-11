import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router';

function App() {
  return (
    <div className='bg-zinc-50 text-zinc-900 min-h-screen'>
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
          element={<h1>Login</h1>}
        />
        <Route
          path='/register'
          element={<h1>Register</h1>}
        />
      </Routes>
    </div>
  );
}

export default App;
