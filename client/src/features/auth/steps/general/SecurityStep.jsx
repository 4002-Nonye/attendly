import { Eye, EyeOff,Lock } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import Box from '../../../../components/Box';
import Err from '../../../../components/Err';
import InputField from '../../../../components/InputField';

function SecurityStep() {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext();
  return (
    <>
      <Box className='relative'>
        <InputField
          htmlFor='password'
          label='Password'
          icon={Lock}
          type='password'
          placeholder='Enter your password'
          eyesOn={Eye}
          eyesOff={EyeOff}
          autoComplete='current-password'
          {...register('password', {
            required: "Password can't be empty",
            minLength: {
              value: 8,
              message: 'Password must be more than 8 characters',
            },
          })}
        />
        <Err msg={errors.password?.message || ' '} />
      </Box>
      <Box>
        <InputField
          htmlFor='current-password'
          label='Confirm Password'
          icon={Lock}
          type='password'
          placeholder='Confirm your password'
          eyesOn={Eye}
          eyesOff={EyeOff}
          autoComplete='current-password'
          {...register('confirmPassword', {
            required: 'Please confirm your password',

            validate: (value) =>
              value === getValues().password || 'Passwords do not match',
          })}
        />
        <Err msg={errors.confirmPassword?.message || ' '} />
      </Box>
    </>
  );
}

export default SecurityStep;
