export default function RegisterPage() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 h-screen'>
      <div className='bg-white rounded-lg shadow-md p-8 w-full max-w-md'>
        <h1 className='font-semibold text-2xl'>Buat akun baru</h1>
        <p className='text-gray-500 text-sm py-1'>Bergabunglah dengan komunitas diskusi.</p>

        <form className='flex flex-col gap-2 mt-4'>
          <label for='name'>Nama</label>
          <input
            type='text'
            id='name'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <label for='email'>Email</label>
          <input
            type='email'
            id='email'
            className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <label for='password'>Password</label>
          <input
            type='password'
            id='password'
            className='border border-gray-300 rounded-md py-2 px-3
            focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type='submit'
            className='cursor-pointer bg-black text-white py-2 px-4 mt-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
