import { CheckCircle, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';

import { getAttendanceColor } from '../../utils/courseHelpers';

function AdminAttendanceDetailsRow({ student, index }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm text-gray-900'>{index + 1}</td>
      <td className='px-6 py-4 text-sm font-medium text-gray-900 uppercase'>
        {student.matricNo}
      </td>
      <td className='px-6 py-4 text-sm text-gray-900 capitalize'>
        {student.fullName}
      </td>
      <td className='px-6 py-4 text-sm text-gray-600'>
        Session {student.enrolledAtSession}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
        {student.totalSessions}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-green-600'>
        {student.totalAttended}
      </td>
      <td className='px-6 py-4 text-sm font-medium text-red-600'>
        {student.totalAbsent}
      </td>
      <td className='px-6 py-4'>
        <span
          className={`text-sm font-bold ${getAttendanceColor(
            student.attendancePercentage
          )}`}
        >
          {student.attendancePercentage}%
        </span>
      </td>
      <td className='px-6 py-4'>
        {student.eligible ? (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium'>
            <CheckCircle className='w-4 h-4' />
            Eligible
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium'>
            <XCircle className='w-4 h-4' />
            Not Eligible
          </span>
        )}
      </td>
    </tr>
  );
}

AdminAttendanceDetailsRow.propTypes = {
  student: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default AdminAttendanceDetailsRow;