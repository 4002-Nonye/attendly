import PropTypes from 'prop-types';
import { CheckCircle, XCircle, Target } from 'lucide-react';

function StudentSessionSummary({ course }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
      <div className='border-b border-gray-100 pb-4 mb-4'>
        <h3 className='text-lg font-semibold text-gray-900 uppercase'>
          {course.courseCode}
        </h3>
        <p className='text-sm text-gray-600 capitalize mt-1'>
          {course.courseTitle}
        </p>

        <div className='flex items-center gap-2 mt-3'>
          <Target className='w-4 h-4 text-blue-600' />
          <span className='text-sm text-gray-600'>
            Required Threshold: <span className='font-semibold text-gray-900'>{course.threshold}%</span>
          </span>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4'>
        <div>
          <p className='text-sm text-gray-600 mb-1'>Total Sessions</p>
          <p className='text-2xl font-bold text-gray-900'>
            {course.totalSessions}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600 mb-1'>Attended</p>
          <p className='text-2xl font-bold text-green-600'>
            {course.totalAttended}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600 mb-1'>Missed</p>
          <p className='text-2xl font-bold text-red-600'>
            {course.totalAbsent}
          </p>
        </div>
        {course.totalPending > 0 && (
          <div>
            <p className='text-sm text-gray-600 mb-1'>Pending</p>
            <p className='text-2xl font-bold text-yellow-600'>
              {course.totalPending}
            </p>
          </div>
        )}
        <div>
          <p className='text-sm text-gray-600 mb-1'>Attendance Rate</p>
          <p className='text-2xl font-bold text-blue-600'>
            {course.attendancePercentage}%
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600 mb-1'>Exam Eligibility</p>
          {course.eligible ? (
            <span className='inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'>
              <CheckCircle className='w-4 h-4' />
              Eligible
            </span>
          ) : (
            <span className='inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium'>
              <XCircle className='w-4 h-4' />
              Not Eligible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

StudentSessionSummary.propTypes = {
  course: PropTypes.shape({
    courseCode: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
    totalSessions: PropTypes.number.isRequired,
    totalAttended: PropTypes.number.isRequired,
    totalAbsent: PropTypes.number.isRequired,
    totalPending: PropTypes.number,
    attendancePercentage: PropTypes.number.isRequired,
    eligible: PropTypes.bool.isRequired,
    threshold: PropTypes.number,
  }).isRequired,
};

export default StudentSessionSummary;