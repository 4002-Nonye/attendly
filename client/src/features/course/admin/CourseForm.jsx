import { useEffect, useMemo } from 'react';
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
import { generateLevel } from '../../../utils/courseHelpers';
import { useCreateCourse } from './useCreateCourse';
import { useEditCourse } from './useEditCourse';

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
          faculty: faculty?._id,
          department: department?._id,
        }
      : {},
  });

  const { schoolId: id } = useSchoolInfo();

  // Faculties
  const { data: facultiesData, isPending: isLoadingFaculties } =
    useAllFaculties({ id });

  // Watch selected faculty to load departments
  const selectedFaculty = watch('faculty');

  // Use faculty from initialData during edit, watched value during create
  const facultyIdForQuery = isEditSession ? faculty?._id : selectedFaculty;

  // Get departments for selected (or initial) faculty
  const { data: departmentOpts, isPending: isPendingDept } = useDepartments({
    id: facultyIdForQuery,
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      reset();
    } else if (
      isEditSession &&
      initialData &&
      departmentOpts?.departments?.length > 0
    ) {
      // populate form for editing after departments load
      reset({
        courseCode,
        courseTitle,
        unit,
        level,
        faculty: faculty?._id,
        department: department?._id,
      });
    } 
  }, [
    isOpen,
    isEditSession,
    initialData,
    departmentOpts,
    reset,
    courseCode,
    courseTitle,
    unit,
    level,
    faculty,
    department,
  ]);

  const { createCourse, isPending: isCreatingCourse } = useCreateCourse();
  const { editCourse, isPending: isEditingCourse } = useEditCourse();

  const isSubmitting = isCreatingCourse || isEditingCourse;
  const selectedDepartment = watch('department');

  // For generating levels
  const selectedDeptData = useMemo(() => {
    if (isEditSession) return department;
    return departmentOpts?.departments?.find(
      (dept) => dept._id === selectedDepartment
    );
  }, [isEditSession, departmentOpts, selectedDepartment, department]);

  const levelOptions = useMemo(() => {
    const maxLevel = selectedDeptData?.maxLevel;
    return generateLevel(maxLevel) || [];
  }, [selectedDeptData]);

  const onSubmit = (data) => {
    if (!isEditSession) {
      createCourse(data, {
        onSuccess: () => {
          reset({});
          onClose();
        },
      });
      return;
    }

    const { courseCode, courseTitle, level, unit } = data;
    editCourse(
      {
        id: editId,
        courseCode,
        courseTitle,
        level: parseInt(level),
        unit: parseInt(unit),
      },
      {
        onSuccess: () => {
          reset({});
          onClose();
        },
      }
    );
  };

  const handleCancel = () => {
    reset({});
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
      {isLoadingFaculties ? (
        <div className='flex justify-center items-center py-8'>
          <ClipLoader size={40} color='#1e1b4b' />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Course Code */}
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
            <Err msg={errors.courseCode?.message || ' '} />
          </Box>

          {/* Course Title */}
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
            <Err msg={errors.courseTitle?.message || ' '} />
          </Box>

          {/* Faculty */}
          <Box>
            <Select
              htmlFor='faculty'
              label='Faculty'
              labelKey='name'
              placeHolder='-- Select Faculty --'
              data={facultiesData?.faculties || []}
              disabled={isLoadingFaculties || isEditSession}
              {...register('faculty', {
                required: !isEditSession && 'Please select a faculty',
              })}
            />
            <Err msg={errors.faculty?.message || ' '} />
          </Box>

          {/* Department */}
          <Box>
            <Select
              htmlFor='department'
              label='Department'
              labelKey='name'
              placeHolder='-- Select Department --'
              data={departmentOpts?.departments || []}
              disabled={isEditSession || !selectedFaculty || isPendingDept}
              {...register('department', {
                required: !isEditSession && 'Please select a department',
              })}
            />
            <Err msg={errors.department?.message || ' '} />
          </Box>

          {/* Level */}
          <Box>
            <Select
              htmlFor='level'
              label='Level'
              labelKey='level'
              placeHolder='-- Select Level --'
              data={levelOptions}
              disabled={
                (!selectedDepartment && !isEditSession) || !levelOptions.length
              }
              {...register('level', {
                required: 'Please select a level',
              })}
            />
            <Err msg={errors.level?.message || ' '} />
          </Box>

          {/* Unit */}
          <Box>
            <InputField
              label='Credit Unit'
              type='number'
              htmlFor='unit'
              placeholder='e.g. 3'
              {...register('unit', {
                required: 'Credit unit is required',
                pattern: {
                  value: /^[1-9][0-9]*$/,
                  message: 'Credit unit must be a valid number',
                },
                max: { value: 10, message: 'Credit unit cannot exceed 10' },
                min: { value: 1, message: 'Credit unit must be at least 1' },
              })}
            />
            <Err msg={errors.unit?.message || ' '} />
          </Box>

          {/* Buttons */}
          <div className='flex justify-end gap-3 pt-3'>
            <Button
              type='button'
              variant='secondary'
              onClick={handleCancel}
              disabled={isSubmitting}
                            className='w-30'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              className='w-30'
              disabled={isSubmitting || (isEditSession && !isDirty)}
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
