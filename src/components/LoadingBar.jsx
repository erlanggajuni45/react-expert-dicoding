import { useSelector } from 'react-redux';

export default function LoadingBar() {
  const loading = useSelector((states) => states.ui.loadingCount > 0);

  if (loading) return null;

  return (
    <div className='fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-transparent'>
      <div className='h-full w-1/3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[loading_1s_linear_infinite]'>
        <style>
          {`@keyframes loading {
        0% { transform: translateX(-100%) }
        100% { transform: translateX(400%) }
        }`}
        </style>
      </div>
    </div>
  );
}
