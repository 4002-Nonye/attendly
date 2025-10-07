import InputField from '../../../../../components/InputField';
import Box from '../../../../../components/Box';
import { useFormContext } from 'react-hook-form';
import { School, CalendarDays, BookOpen } from 'lucide-react';
import Err from '../../../../../components/Err';

<School />;
function AdminStepTwo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  console.log(errors)
  return (
    <>
      <Box className='relative'>
        <InputField
          htmlFor='school'
          label='School'
          icon={School}
          placeholder='e.g University of Lagos'
          type='text'
          {...register('school', {
            required: {
              value: true,
              message: "Please enter your school's name",
            },
          })}
        />
        <Err
          msg={errors.school?.message || ' '}
          
        />
      </Box>
      <div className='flex gap-5'>
        <Box className='relative'>
          <InputField
            htmlFor='session'
            label='Session'
            placeholder='e.g 2024/2025'
            icon={CalendarDays}
            type='text'
            {...register('session', {
            required: {
              value: true,
              message: "Please enter session",
            },
            pattern:{
              value: /^\d{4}\/\d{4}$/,
              message:'Use format YYYY/YYYY'
            }
          })}
        />
        <Err
          msg={errors.session?.message || ' '}
          
        />
        </Box>
        <Box className='relative'>
          <InputField
            htmlFor='semester'
            label='Semester'
            icon={BookOpen}
            placeholder='e.g First'
            type='text'
          {...register('semester', {
            required: {
              value: true,
              message: "Please enter semester",
            },
          })}
        />
        <Err
          msg={errors.semester?.message || ' '}
          
        />
        </Box>
      </div>
    </>
  );
}

export default AdminStepTwo;
