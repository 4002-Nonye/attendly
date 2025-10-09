import Box from '../../../../../components/Box';
import { useFormContext } from 'react-hook-form';

import Err from '../../../../../components/Err';

function LecturerStepTwo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Example options
  const schoolOptions = [
    { value: 'school1', label: 'School One' },
    { value: 'school2', label: 'School Two' },
    { value: 'school3', label: 'School Three' },
  ];

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
      <Box className="relative">
        <label
          htmlFor="school"
          className="block text-sm font-medium mb-2 text-gray-700"
        >
          Select your school
        </label>

        <select
          id="school"
          {...register('school', {
            required: { value: true, message: 'Please select your school' },
          })}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer py-4 "
        >
          <option value="" >-- Select School --</option>
          {schoolOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <Err msg={errors.school?.message || ' '} />
      </Box>

      <div className="flex flex-col lg:flex-row gap-2 md:gap-5 ">
        {/* Faculty */}
        <Box className="relative">
          <label
            htmlFor="faculty"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Select your faculty
          </label>

          <select
            id="faculty"
            {...register('faculty', {
              required: { value: true, message: 'Please select your faculty' },
            })}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer py-4"
          >
            <option value="">-- Select Faculty --</option>
            {facultyOptions.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <Err msg={errors.faculty?.message || ' '} />
        </Box>

        {/* Department */}
        <Box className="relative">
          <label
            htmlFor="department"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Select your department
          </label>

          <select
            id="department"
            {...register('department', {
              required: {
                value: true,
                message: 'Please select your department',
              },
            })}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer py-4"
          >
            <option value="">-- Select Department --</option>
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
