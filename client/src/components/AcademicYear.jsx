import PropTypes from 'prop-types';

function AcademicYear({ academicYear, semester }) {
  return (
    <div className='flex gap-8 text-sm'>
      <div className='text-center md:text-left'>
        <p className='text-gray-600 font-medium'>Academic Year</p>
        <p className='text-gray-900 font-semibold text-lg'>
          {academicYear || ''}
        </p>
      </div>

      <div className='text-center md:text-left'>
        <p className='text-gray-600 font-medium'>Semester</p>
        <p className='text-gray-900 font-semibold text-lg'>{semester || ''}</p>
      </div>
    </div>
  );
}

AcademicYear.propTypes = {
  academicYear: PropTypes.string.isRequired,
  semester: PropTypes.string.isRequired,
};

export default AcademicYear;
