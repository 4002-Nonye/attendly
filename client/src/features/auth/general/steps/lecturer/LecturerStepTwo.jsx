import Box from '../../../../../components/Box';
import { useFormContext } from 'react-hook-form';

import Err from '../../../../../components/Err';

import { useSchools } from '../../../../school/useSchools';
import { useState } from 'react';
import Select from '../../../../../components/Select';

function LecturerStepTwo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [selectedSchoolId, setSelectedSchoolId] = useState('');

  const { data, isPending } = useSchools();
  console.log(selectedSchoolId);
  const facultyOptions = [
    { value: 'Social science', label: 'Social science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Arts', label: 'Arts' },
  ];

  const departmentOptions = [
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Political science', label: 'Political science' },
    { value: 'Economics', label: 'Economics' },
  ];

  return (
    <>
      {/* School */}
      <Box>
        <Select
          htmlFor='school'
          label='School'
          placeHolder='-- Select School --'
          data={data?.schools}
          {...register('school', {
            required: { value: true, message: 'Please select your school' },
            onChange: (e) => setSelectedSchoolId(e.target.value),
          })}
        />

        <Err msg={errors.school?.message || ' '} />
      </Box>

      <div className='flex flex-col lg:flex-row gap-2 md:gap-5 '>
        {/* Faculty */}
        <Box>
          <label
            htmlFor='faculty'
            className='block text-sm font-medium mb-2 text-gray-700'
          >
            Select your faculty
          </label>

          <select
            id='faculty'
            {...register('faculty', {
              required: { value: true, message: 'Please select your faculty' },
            })}
            className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer py-4'
          >
            <option value=''>-- Select Faculty --</option>
            {facultyOptions.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <Err msg={errors.faculty?.message || ' '} />
        </Box>

        {/* Department */}
        <Box>
          <label
            htmlFor='department'
            className='block text-sm font-medium mb-2 text-gray-700'
          >
            Select your department
          </label>

          <select
            id='department'
            {...register('department', {
              required: {
                value: true,
                message: 'Please select your department',
              },
            })}
            className='border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer py-4'
          >
            <option value=''>-- Select Department --</option>
            {departmentOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>

          <Err msg={errors.department?.message || ' '} />
        </Box>
      </div>
    </>
  );
}

export default LecturerStepTwo;
