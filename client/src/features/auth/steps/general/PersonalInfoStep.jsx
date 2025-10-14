
import { useFormContext } from 'react-hook-form';
import Box from '../../../../components/Box';
import InputField from '../../../../components/InputField';
import { User, Mail } from 'lucide-react';
import Err from '../../../../components/Err';

function PersonalInfoStep() {
    const {
        register,
        formState: { errors },
      } = useFormContext();
 return (
    <>
      <Box >
        <InputField
          htmlFor='name'
          label='Full Name'
          placeholder='John Doe'
          type='text'
          icon={User}
          autoComplete='name'
          {...register('fullName', {
            required: {
              value: true,
              message: 'Please enter your full name',
            },
          })}
        />
        <Err msg={errors.fullName?.message || ' '} />
      </Box>
      <Box >
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
        <Err msg={errors.email?.message || ' '} />
      </Box>
    </>
  );
}

export default PersonalInfoStep