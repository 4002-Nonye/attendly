import PropTypes from 'prop-types';

function AttendanceReportHeader({ course, summary, showCourseDetails = false }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
      {/* Course Title */}
      <div className='border-b border-gray-100 pb-4 mb-4'>
        <h3 className='text-lg font-semibold text-gray-900 uppercase'>
          {course.courseCode}
        </h3>
        <p className='text-sm text-gray-600 capitalize mt-1'>
          {course.courseTitle}
        </p>
        
        {/* department, faculty, level */}
        {showCourseDetails && course.department && (
          <div className='flex gap-4 mt-2 text-xs text-gray-500'>
            <span className='capitalize'>{course.department.name}</span>
            <span>•</span>
            <span className='capitalize'>
              Faculty of {course.faculty?.name}
            </span>
            <span>•</span>
            <span>Level {course.level}</span>
          </div>
        )}
      </div>

      {/* Report Stats */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
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
        
        {summary.threshold && (
          <div>
            <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>
              Threshold
            </p>
            <p className='text-2xl font-bold text-blue-600'>
              {summary.threshold}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

AttendanceReportHeader.propTypes = {
  course: PropTypes.shape({
    courseCode: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
    totalSessions: PropTypes.number,
    department: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    faculty: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
    level: PropTypes.number,
  }).isRequired,
  summary: PropTypes.shape({
    totalStudents: PropTypes.number,
    eligibleCount: PropTypes.number,
    notEligibleCount: PropTypes.number,
    threshold: PropTypes.number,
  }).isRequired,
  showCourseDetails: PropTypes.bool,
};

export default AttendanceReportHeader;