import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { MdLockOutline, MdOutlineEmail } from 'react-icons/md';
import logoBlack from '../../assets/logo-black.svg';

import googleIcon from '../../assets/icons8-google.svg';

import Box from '../../components/Box';
import Err from '../../components/Err';
import InputField from '../../components/InputField';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import FormHeader from '../../components/FormHeader';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const onError = (err) => {
    console.log(err);
  };
  return (
    <div className='lg:w-2/4 w-full h-dvh flex flex-col lg:justify-center  p-3 '>
      {/* LOGO - only mobile  screens */}
      <div className='md:text-4xl text-xl font-bold flex items-center pt-7 lg:pt-0 lg:hidden md:px-12 md:justify-center'>
        <img src={logoBlack} alt='logo' className='md:w-16' />{' '}
        <span>Attendly</span>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className='w-full md:p-20 lg:p-10 xl:p-40 p-5 mt-18 md:mt-0'
        noValidate={true}
      >
        {/* FORM HEAD */}
        <FormHeader text='Log in to your account' />

        <div className='flex flex-col gap-6'>
          {/* EMAIL BOX */}
          <Box>
            <InputField
              htmlFor='email'
              label='Email'
              icon={MdOutlineEmail}
              placeholder='e.g userexample@gmail.com'
              type='email'
              autoComplete='email'
              {...register('email', {
                required: {
                  value: true,
                  message: "Email can't be empty",
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address.',
                },
              })}
            />
            {errors.email && <Err msg={errors.email.message} />}
          </Box>

          {/* PASSWORD BOX */}
          <Box>
            <InputField
              htmlFor='password'
              label='Password'
              icon={MdLockOutline}
              type='password'
              placeholder='Enter your password'
              eyesOn={IoMdEye}
              eyesOff={IoMdEyeOff}
              autoComplete='current-password'
              {...register('password', {
                required: {
                  value: true,
                  message: "Password can't be empty",
                },
                minLength: {
                  value: 8,
                  message: 'Password must be more than 8 characters',
                },
              })}
            />
            {errors.password && <Err msg={errors.password.message} />}
          </Box>
        </div>

        {/* LOGIN CTA */}
        <Button
          fullWidth={true}
          variant='primary'
          size='lg'
          className=' mb-6 mt-7'
          type='submit'
        >
          Login
        </Button>

        {/* DIVIDER */}
        <Divider text='OR' />

        {/* LOGIN WITH GOOGLE CTA */}
        <Button
          className=' mb-8 mt-7 rounded-md '
          fullWidth={true}
          variant='outline'
          size='lg'
        >
          <img src={googleIcon} alt='google' className='w-8' /> &nbsp;{' '}
          <span> Login with Google</span>
        </Button>

        {/* DIVIDER */}
        <Divider />

        {/*   SIGN UP LINK */}
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
