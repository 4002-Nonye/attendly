import PropTypes from 'prop-types';

function AttendanceReportHeader({ course, summary }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6  '>
      {/* Course Title */}
      <div className='border-b border-gray-100 pb-4 mb-4'>
        <h3 className='text-lg font-semibold text-gray-900 uppercase'>
          {course.courseCode}
        </h3>
        <p className='text-sm text-gray-600 capitalize mt-1'>
          {course.courseTitle}
        </p>
      </div>

      {/* Report Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        <div>
          <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
            Total Sessions{' '}
            <span className='font-bold text-[10px] text-red-500'>
              (completed)
            </span>
          </p>
          <p className='text-2xl font-bold'>{course.totalSessions || 0}</p>
        </div>
        <div>
          <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
            Total Students
          </p>
          <p className='text-2xl font-bold text-gray-900'>
            {summary.totalStudents || 0}
          </p>
        </div>
        <div>
          <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
            Eligible
          </p>
          <p className='text-2xl font-bold text-green-600'>
            {summary.eligibleCount || 0}
          </p>
        </div>
        <div>
          <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
            Not Eligible
          </p>
          <p className='text-2xl font-bold text-red-600'>
            {summary.notEligibleCount || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

AttendanceReportHeader.propTypes = {
  course: PropTypes.shape({
    courseCode: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
    totalSessions: PropTypes.number,
  }).isRequired,
  summary: PropTypes.shape({
    totalStudents: PropTypes.number,
    eligibleCount: PropTypes.number,
    notEligibleCount: PropTypes.number,
  }).isRequired,
};

export default AttendanceReportHeader;
