import { FileText } from 'lucide-react';
import PropTypes from 'prop-types';

import { getAttendanceColor } from '../../utils/courseHelpers';

function AdminAttendanceOverviewRow({ course, onViewReport }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div>
          <p className='text-sm font-semibold text-gray-900 uppercase'>
            {course.courseCode}
          </p>
          <p className='text-xs text-gray-600 capitalize'>
            {course.courseTitle}
          </p>
        </div>
      </td>
      <td className='px-6 py-4'>
        <div>
          <p className='text-sm text-gray-700 capitalize'>
            {course.department?.name || '-'}
          </p>
          <p className='text-xs text-gray-500 capitalize'>
            Faculty of {course.faculty?.name || '-'}
          </p>
        </div>
      </td>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {course.level}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {course.totalStudents}
      </td>
      <td className='px-6 py-4'>
        {course.totalSessions > 0 ? (
          <span
            className={`text-sm font-bold ${getAttendanceColor(
              course.avgAttendance
            )}`}
          >
            {course.avgAttendance}%
          </span>
        ) : (
          <span className='text-sm text-gray-400'>No sessions</span>
        )}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-green-600'>
        {course.eligibleCount}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-red-600'>
        {course.notEligibleCount}
      </td>
      <td className='px-6 py-4'>
        <button
          className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => onViewReport(course._id)}
          disabled={course.totalStudents === 0}
          title={
            course.totalStudents === 0
              ? 'No students enrolled'
              : 'View detailed report'
          }
        >
          <FileText className='w-4 h-4' />
          View Report
        </button>
      </td>
    </tr>
  );
}

AdminAttendanceOverviewRow.propTypes = {
  course: PropTypes.object.isRequired,
  onViewReport: PropTypes.func.isRequired,
};

export default AdminAttendanceOverviewRow;