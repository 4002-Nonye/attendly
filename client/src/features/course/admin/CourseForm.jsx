import { useForm } from 'react-hook-form';
import Modal from '../../../components/Modal';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';
import Button from '../../../components/Button';
import Err from '../../../components/Err';
import InputField from '../../../components/InputField';
import Select from '../../../components/Select';
import Box from '../../../components/Box';
import { useSchoolInfo } from '../../../hooks/useSchoolInfo';
import { useAllFaculties } from '../../faculty/admin/useAllFaculties';
import { useDepartments } from '../../department/general/useDeparments';

function CourseForm({ isOpen, onClose, initialData }) {
  const {
    _id: editId,
    courseCode,
    courseTitle,
    unit,
    level,
    faculty,
    department,
  } = initialData || {};

  const isEditSession = Boolean(editId);

  const {
    reset,
    register,
    watch,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: isEditSession
      ? {
          courseCode,
          courseTitle,
          unit,
          level,
          faculty: faculty._id,
          department: department._id,
        }
      : {},
  });

  // Watch selected faculty to populate departments
  const selectedFaculty = watch('faculty');


  const { data: departmentOpts, isPending } = useDepartments({
    id: selectedFaculty,
  });
  const isSubmitting = false;

  const { schoolId: id } = useSchoolInfo();

  // Fetch faculties
  const { data: facultiesData, isPending: isLoadingFaculties } =
    useAllFaculties({ id });

  // Level options
  const levelOptions = [
    { _id: '100', name: '100' },
    { _id: '200', name: '200' },
    { _id: '300', name: '300' },
    { _id: '400', name: '400' },
    { _id: '500', name: '500' },
    { _id: '600', name: '600' },
    { _id: '700', name: '700' },
  ];

  const onSubmit = (data) => {
    // Convert level and unit to numbers
    const payload = {
      courseCode: data.courseCode,
      courseTitle: data.courseTitle,
      department: data.department,
      faculty: data.faculty,
      level: parseInt(data.level),
      unit: parseInt(data.unit),
    };

    console.log('Submitting:', payload);
    // TODO: Call create/update mutation here
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={isEditSession ? 'Edit Course' : 'Add New Course'}
      closeOnOutsideClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      size='lg'
    >
      {isEditSession && isLoadingFaculties ? (
        <div className='flex justify-center items-center py-8'>
          <ClipLoader size={32} color='#3b82f6' />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <InputField
              label='Course Code'
              type='text'
              htmlFor='courseCode'
              placeholder='e.g. CSC 201'
              {...register('courseCode', {
                required: 'Course code is required',
                minLength: {
                  value: 3,
                  message: 'Course code must be at least 3 characters',
                },
              })}
            />
            <Err
              className={errors.courseCode?.message && 'mb-3'}
              msg={errors.courseCode?.message || ' '}
            />
          </Box>

          <Box>
            <InputField
              label='Course Title'
              type='text'
              htmlFor='courseTitle'
              placeholder='e.g. Introduction to Computer Science'
              {...register('courseTitle', {
                required: 'Course title is required',
                minLength: {
                  value: 3,
                  message: 'Course title must be at least 3 characters',
                },
              })}
            />
            <Err
              className={errors.courseTitle?.message && 'mb-3'}
              msg={errors.courseTitle?.message || ' '}
            />
          </Box>

          <Box>
            <Select
              htmlFor='faculty'
              label='Faculty'
              labelKey='name'
              placeHolder='-- Select Faculty --'
              data={facultiesData?.faculties || []}
              disabled={isLoadingFaculties}
              {...register('faculty', {
                required: 'Please select a faculty',
              })}
            />
            <Err
              className={errors.faculty?.message && 'mb-3'}
              msg={errors.faculty?.message || ' '}
            />
          </Box>

          <Box>
            <Select
              htmlFor='department'
              label='Department'
              labelKey='name'
              placeHolder='-- Select Department --'
              data={departmentOpts?.departments}
              disabled={!selectedFaculty}
              {...register('department', {
                required: 'Please select a department',
              })}
            />
            <Err
              className={errors.department?.message && 'mb-3'}
              msg={errors.department?.message || ' '}
            />
          </Box>

          <Box>
            <Select
              htmlFor='level'
              label='Level'
              labelKey='name'
              placeHolder='-- Select Level --'
              data={levelOptions}
              {...register('level', {
                required: 'Please select a level',
              })}
            />
            <Err
              className={errors.level?.message && 'mb-3'}
              msg={errors.level?.message || ' '}
            />
          </Box>

          <Box>
            <InputField
              label='Credit Unit'
              type='text'
              htmlFor='unit'
              placeholder='e.g. 3'
              {...register('unit', {
                required: 'Credit unit is required',
                pattern: {
                  value: /^[1-9][0-9]*$/,
                  message: 'Credit unit must be a valid number',
                },
                max: {
                  value: 10,
                  message: 'Credit unit cannot exceed 10',
                },
                min: {
                  value: 1,
                  message: 'Credit unit must be at least 1',
                },
              })}
            />
            <Err
              className={errors.unit?.message && 'mb-3'}
              msg={errors.unit?.message || ' '}
            />
          </Box>

          <div className='flex gap-3 justify-end pt-2'>
            <Button
              type='button'
              className='w-26'
              variant='secondary'
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              disabled={isSubmitting || (isEditSession && !isDirty)}
              className='w-26'
            >
              {isSubmitting ? <ClipLoader size={16} color='white' /> : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

CourseForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default CourseForm;
