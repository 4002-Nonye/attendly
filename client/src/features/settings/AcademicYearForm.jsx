import { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';

import Alert from '../../components/Alert';
import Box from '../../components/Box';
import Button from '../../components/Button';
import Err from '../../components/Err';
import InputField from '../../components/InputField';
import Modal from '../../components/Modal';

import { useCreateAcademicYear } from './useCreateAcademicYear';


export default function AcademicYearForm({ isOpen, onClose }) {
  const { createAcademicYear, isPending } = useCreateAcademicYear();

 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      year: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ year: '' });
    }
  }, [isOpen, reset]);

  // Validate academic year format (YYYY/YYYY)
  const validateAcademicYear = (value) => {
    if (!value) return 'Academic year is required';

    const regex = /^\d{4}\/\d{4}$/;
    if (!regex.test(value)) {
      return 'Format must be YYYY/YYYY (e.g., 2025/2026)';
    }

    const [startYear, endYear] = value.split('/').map(Number);

    if (endYear !== startYear + 1) {
      return 'End year must be exactly one year after start year';
    }

    const currentYear = new Date().getFullYear();
    if (startYear < currentYear - 5 || startYear > currentYear + 10) {
      return 'Year must be within reasonable range';
    }

    return true;
  };

  const onSubmit = (data) => {
    console.log(data);
    createAcademicYear(
      { year: data.year },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  // Auto-format input as user types
  const handleYearInput = (e) => {
    let value = e.target.value.replace(/[^\d/]/g, ''); // only allow digits and /

    // Auto-add slash after 4 digits
    if (value.length === 4 && !value.includes('/')) {
      value = value + '/';
    }

    // limit to 9 characters (YYYY/YYYY)
    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    e.target.value = value;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title='Create New Academic Year'
      closeOnOutsideClick={!isPending}
      closeOnEscape={!isPending}
      size='lg'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Warning Alert */}
        <Alert
          type='warning'
          size='md'
          showBorder
          className='mb-4'
          title='Warning: This action cannot be undone'
          message='Creating a new academic year will automatically promote all students by one level and set this as the active year. You cannot switch back to previous academic years once this is created.'
        />

        <Box className='mb-4'>
          <InputField
            htmlFor='year'
            label='Academic Year'
            icon={Calendar}
            type='text'
            placeholder='YYYY/YYYY (e.g., 2025/2026)'
            disabled={isPending}
            onInput={handleYearInput}
            {...register('year', {
              validate: validateAcademicYear,
            })}
          />
          <Err msg={errors.year?.message || ' '} />
        </Box>

        {/* Action Buttons */}
        <div className='flex gap-3 justify-end pt-2'>
          <Button
            type='button'
            className='w-32'
            size='sm'
            variant='secondary'
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='primary'
            disabled={isPending}
            className='w-32'
                        size='sm'
          >
            {isPending ? <ClipLoader size={16} color='white' /> : 'Create Year'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

AcademicYearForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
