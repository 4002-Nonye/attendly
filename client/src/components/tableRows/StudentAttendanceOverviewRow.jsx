import { AlertCircle,Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

import { getAttendanceColor, getEligibilityStyle } from '../../utils/courseHelpers';
import Button from '../Button';

function StudentAttendanceOverviewRow({ course, onViewDetails }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-semibold text-gray-900 uppercase'>
        {course.courseCode}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {course.courseTitle}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 text-center'>
        {course.totalSessions}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-green-600 text-center'>
        {course.totalAttended}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-yellow-600 text-center'>
        {course.totalPending}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-red-600 text-center'>
        {course.totalMissed}
      </td>
      <td className='px-6 py-4 text-center'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAttendanceColor(
            course.attendancePercentage
          )}`}
        >
          {course.attendancePercentage}%
        </span>
      </td>
      <td className='px-6 py-4 text-center'>
        {course.eligible ? (
          <span className={getEligibilityStyle(course.eligible)}>
            <Calendar className='w-3 h-3' />
            Eligible
          </span>
        ) : (
          <span className={getEligibilityStyle(course.eligible)}>
            <AlertCircle className='w-3 h-3' />
            Not Eligible
          </span>
        )}
      </td>

      <td className='px-6 py-4 text-center'>
        <Button
          onClick={() => onViewDetails(course.courseId)}
          variant='primary'
          size='sm'
          disabled={!course.totalSessions}
        >
          <span className='hidden sm:inline'>View Details</span>
        </Button>
      </td>
    </tr>
  );
}

StudentAttendanceOverviewRow.propTypes = {
  course: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default StudentAttendanceOverviewRow;