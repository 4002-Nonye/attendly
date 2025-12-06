import { AlertCircle,Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

import { getAttendanceColor, getEligibilityStyle } from '../../utils/courseHelpers';

function LecturerAttendanceReportRow({ student }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900 uppercase'>
        {student.matricNo}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.fullName}
      </td>
      <td className='px-6 py-4'>
        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium'>
          Session {student.enrolledAtSession}
        </span>
      </td>
      <td className='px-6 py-4'>
        <span className='text-sm font-semibold text-gray-900'>
          {student.totalSessions}
        </span>
      </td>
      <td className='px-6 py-4'>
        <span className='text-sm font-semibold text-green-600'>
          {student.totalAttended}
        </span>
      </td>
      <td className='px-6 py-4'>
        <span className='text-sm font-semibold text-red-600'>
          {student.totalAbsent}
        </span>
      </td>
      <td className='px-6 py-4'>
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getAttendanceColor(
            student.attendancePercentage
          )}`}
        >
          {student.attendancePercentage}%
        </span>
      </td>
      <td className='px-6 py-4'>
        {student.eligible ? (
          <span className={getEligibilityStyle(student.eligible)}>
            <Calendar className='w-3 h-3' />
            Eligible
          </span>
        ) : (
          <span className={getEligibilityStyle(student.eligible)}>
            <AlertCircle className='w-3 h-3' />
            Not Eligible
          </span>
        )}
      </td>
    </tr>
  );
}

LecturerAttendanceReportRow.propTypes = {
  student: PropTypes.object.isRequired,
};

export default LecturerAttendanceReportRow;