import { useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '../../components/Box';

import { MdOutlineEmail } from 'react-icons/md';
import { MdLockOutline } from 'react-icons/md';
import { IoMdEyeOff } from 'react-icons/io';
import { IoMdEye } from 'react-icons/io';

import googleIcon from '../../assets/icons8-google.svg';
import logoBlack from '../../assets/logo-black.svg';
function Login() {
  const [passwordType, setPasswordType] = useState('text');
  return (
    <div className='lg:w-2/4 w-full h-dvh flex flex-col lg:justify-center  p-3 '>
      <div className='md:text-4xl text-xl font-bold flex items-center pt-7 lg:pt-0 lg:hidden md:px-12 md:justify-center'>
        {' '}
        <img src={logoBlack} alt='logo' className='md:w-16'/> <span>Attendly</span>
      </div>
      <form className='w-full md:p-20 lg:p-10 xl:p-40 p-5 mt-18 md:mt-0'>
        <h2 className='text-2xl md:2xl font-medium mb-8 ' >
          Log in to your account
        </h2>

        <div className='flex flex-col gap-6'>
          {' '}
          <Box>
            <label htmlFor='email'>Email Address</label>
            <div className='relative'>
              {' '}
              <MdOutlineEmail className='absolute top-5 text-gray-500 text-lg  left-3' />
              <input
                type='text'
                name='email'
                id='email'
                placeholder='e.g userexample@gmail.com'
              />
            </div>
          </Box>
          <Box>
            <label htmlFor='password'>Password</label>
            <div className='relative'>
              <MdLockOutline className='absolute top-5 text-gray-500 text-lg  left-3' />
              <input
                type={passwordType}
                name='password'
                id='password'
                placeholder='Enter your password'
              />
              <IoMdEye className='absolute right-3 text-lg top-5 text-gray-500' />
            </div>
          </Box>
        </div>

        <button className='bg-blue-950 text-white mb-6 mt-7 rounded-md p-3 md:p-4 w-full'>
          Login
        </button>
        <div className='flex items-center mb-5'>
          <hr className='flex-grow border-t border-gray-300' />
          <span className='mx-3 text-gray-500 font-medium text-sm'>OR</span>
          <hr className='flex-grow border-t border-gray-300' />
        </div>

        <button className='border-2 border-gray-300 mb-6 mt-7 rounded-md p-3 md:p-4 w-full flex justify-center items-center'>
          <img src={googleIcon} alt='google' className='w-8' /> &nbsp;{' '}
          <span> Login with Google</span>
        </button>
        <hr className='text-gray-300 my-5' />
        <p className='text-center'>
          Don't have an account?{' '}
          <Link to='/signup' className=' text-blue-700'>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
