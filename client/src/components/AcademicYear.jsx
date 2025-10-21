
import { useSchoolInfo } from '../hooks/useSchoolInfo';

function AcademicYear() {
  const {  semester, academicYear } = useSchoolInfo();

  return (
    <div className='flex gap-8 text-sm'>
      <div className='text-left'>
        <p className='text-gray-600 font-medium'>Academic Year</p>
        <p className='text-gray-700 font-medium text-sm'>
          {academicYear || 'Not set'}
        </p>
      </div>

      <div className='text-left'>
        <p className='text-gray-600 font-medium'>Semester</p>
        <p className='text-gray-700 font-medium text-sm'>{semester || 'Not set'}</p>
      </div>
    </div>
  );
}

export default AcademicYear;
