import InputField from '../../../../components/InputField';
import Box from '../../../../components/Box';
import { useFormContext } from 'react-hook-form';
import { School, MapPin } from 'lucide-react';
import Err from '../../../../components/Err';

function AdminStepTwo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <p className='text-gray-700 mb-6'>
        Tell us the name of your school. You can always update more details later.
      </p>

      {/* SCHOOL NAME */}
      <Box className='relative'>
        <InputField
          htmlFor='school'
          label='School name'
          icon={School}
          placeholder='e.g. University of Lagos'
          type='text'
          {...register('school', {
            required: {
              value: true,
              message: "Please enter your school's name",
            },
          })}
        />
        <Err msg={errors.school?.message || ' '} />
      </Box>

      <Box className='relative'>
        <InputField
          htmlFor='location'
          label='Location (optional)'
          icon={MapPin}
          placeholder='e.g. Lagos, Nigeria'
          type='text'
          {...register('location')}
        />
      </Box>
    </>
  );
}

export default AdminStepTwo;
