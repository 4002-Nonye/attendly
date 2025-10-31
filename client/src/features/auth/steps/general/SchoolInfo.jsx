import PropTypes from 'prop-types';
import Box from '../../../../components/Box';
import { useFormContext } from 'react-hook-form';
import { useEffect, useRef } from 'react';

import Err from '../../../../components/Err';
import Select from '../../../../components/Select';

import { useSchools } from '../../../school/useSchools';
import { useFaculties } from '../../../faculty/general/useFaculties';
import { useDepartments } from '../../../department/general/useDeparments';

import toast from 'react-hot-toast';
import InputField from '../../../../components/InputField';

function SchoolInfo({ showLevel = false, showMatric = false }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const selectedSchoolId = watch('school');
  const selectedFacultyId = watch('faculty');
  const selectedDepartmentId = watch('department');

  // Track previous values to detect when a value actually changes
  const prevSchoolIdRef = useRef(selectedSchoolId);
  const prevFacultyIdRef = useRef(selectedFacultyId);
  const prevDepartmentRef = useRef(selectedDepartmentId);

  const { data: schoolData, isPending: isLoadingSchools } = useSchools();

  const {
    data: facultyData,
    isPending: isLoadingFaculties,
    isError: isFacultyError,
    error: facultyError,
  } = useFaculties({
    id: selectedSchoolId,
  });

  const {
    data: departmentData,
    isPending: isLoadingDepartments,
    isError: isDepartmentError,
    error: departmentError,
  } = useDepartments({
    id: selectedFacultyId,
  });

  // Get the currently selected department object
  const selectedDepartment = departmentData?.departments?.find(
    (dept) => dept._id === selectedDepartmentId
  );

  // Get its maxLevel (default to 400 if not found)
  const maxLevel = selectedDepartment?.maxLevel || 400;

  // Generate level options dynamically
  const levelOptions = Array.from(
    { length: Math.floor(maxLevel / 100) },
    (_, i) => {
      const levelValue = (i + 1) * 100;
      return {
        _id: levelValue.toString(),
        level: `${levelValue} Level`,
      };
    }
  );

  // Show toast error for faculties
  useEffect(() => {
    if (isFacultyError) {
      toast.error(facultyError?.error || 'Failed to load faculties');
    }
  }, [isFacultyError, facultyError]);

  // Show toast error for departments
  useEffect(() => {
    if (isDepartmentError) {
      toast.error(departmentError?.error || 'Failed to load departments');
    }
  }, [isDepartmentError, departmentError]);

  // Reset faculty, department, and level when school actually changes
  useEffect(() => {
    if (
      prevSchoolIdRef.current !== selectedSchoolId &&
      prevSchoolIdRef.current !== undefined
    ) {
      setValue('faculty', '');
      setValue('department', '');
      if (showLevel) setValue('level', '');
    }
    prevSchoolIdRef.current = selectedSchoolId;
  }, [selectedSchoolId, setValue, showLevel]);

  // Reset department and level when faculty actually changes
  useEffect(() => {
    if (
      prevFacultyIdRef.current !== selectedFacultyId &&
      prevFacultyIdRef.current !== undefined
    ) {
      setValue('department', '');
      if (showLevel) setValue('level', '');
    }
    prevFacultyIdRef.current = selectedFacultyId;
  }, [selectedFacultyId, setValue, showLevel]);

  // Reset level when department ACTUALLY changes
  useEffect(() => {
    if (
      prevDepartmentRef.current !== selectedDepartmentId &&
      prevDepartmentRef.current !== undefined
    ) {
      setValue('level', '');
    }
    prevDepartmentRef.current = selectedDepartmentId;
  }, [selectedDepartmentId, setValue]);

  return (
    <>
      {/* School */}
      <Box>
        <Select
          htmlFor='school'
          label='School'
          placeHolder={
            isLoadingSchools ? 'Loading schools...' : '-- Select School --'
          }
          data={schoolData?.schools || []}
          disabled={isLoadingSchools}
          {...register('school', {
            required: { value: true, message: 'Please select your school' },
          })}
        />
        <Err msg={errors.school?.message || ' '} />
      </Box>

      <div className='flex flex-col lg:flex-row gap-2 md:gap-5'>
        {/* Faculty */}
        <Box>
          <Select
            htmlFor='faculty'
            label='Faculty'
            placeHolder={
              !selectedSchoolId
                ? 'Select school first'
                : isLoadingFaculties
                ? 'Faculties loading...'
                : '-- Select Faculty --'
            }
            data={facultyData?.faculties || []}
            labelKey='name'
            disabled={!selectedSchoolId || isLoadingFaculties}
            {...register('faculty', {
              required: { value: true, message: 'Please select your faculty' },
            })}
          />
          <Err msg={errors.faculty?.message || ' '} />
        </Box>

        {/* Department */}
        <Box>
          <Select
            htmlFor='department'
            label='Department'
            placeHolder={
              !selectedFacultyId
                ? 'Select faculty first'
                : isLoadingDepartments
                ? 'Departments loading...'
                : '-- Select Department --'
            }
            data={departmentData?.departments ||[]}
            labelKey='name'
            disabled={!selectedFacultyId || isLoadingDepartments}
            {...register('department', {
              required: {
                value: true,
                message: 'Please select your department',
              },
            })}
          />
          <Err msg={errors.department?.message || ' '} />
        </Box>
      </div>

      {/* Level  and Matric Number - Only show for students */}
      <div className='flex flex-col lg:flex-row gap-2 md:gap-5'>
        {showLevel && (
          <Box>
            <Select
              htmlFor='level'
              label='Level'
              placeHolder={
                !selectedDepartmentId
                  ? 'Select department first'
                  : '-- Select Level --'
              }
              data={levelOptions}
              labelKey='level'
              disabled={!selectedDepartmentId}
              {...register('level', {
                required: {
                  value: true,
                  message: 'Please select your level',
                },
              })}
            />
            <Err msg={errors.level?.message || ' '} />
          </Box>
        )}
        {showMatric && (
          <Box className='relative'>
            <InputField
              htmlFor='matricNo'
              label='Matric ID'
              placeholder='230903058'
              type='text'
              {...register('matricNo', {
                required: {
                  value: true,
                  message: 'Please enter your matric ID',
                },
              })}
            />
            <Err msg={errors.matricNo?.message || ' '} />
          </Box>
        )}
      </div>
    </>
  );
}

SchoolInfo.propTypes = {
  showLevel: PropTypes.bool,
  showMatric: PropTypes.bool,
};

export default SchoolInfo;
