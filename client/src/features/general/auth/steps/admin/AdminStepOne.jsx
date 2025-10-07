import Box from '../../../../../components/Box';
import InputField from '../../../../../components/InputField';
import { useFormContext } from 'react-hook-form';
import { User, Mail } from 'lucide-react';
import Err from '../../../../../components/Err';

function AdminStepOne() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Box className='relative'>
        <InputField
          htmlFor='name'
          label='Full Name'
          placeholder='John Doe'
          type='text'
          icon={User}
          autoComplete='name'
          {...register('name', {
            required: {
              value: true,
              message: 'Please enter your full name',
            },
          })}
        />
        <Err msg={errors.name?.message || ' '}  />
      </Box>
      <Box className='relative'>
        <InputField
          htmlFor='email'
          label='Email'
          icon={Mail}
          placeholder='johndoe@gmail.com'
          type='email'
          autoComplete='email'
          {...register('email', {
            required: {
              value: true,
              message: 'Please enter your email',
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address.',
            },
          })}
        />
        <Err msg={errors.email?.message || ' '}  />
      </Box>
    </>
  );
}

export default AdminStepOne;
