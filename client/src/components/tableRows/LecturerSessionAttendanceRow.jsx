import { Clock } from 'lucide-react';
import PropTypes from 'prop-types';

import { formatTime } from '../../utils/dateHelper';
import StatusBadge from '../StatusBadge';

function LecturerSessionAttendanceRow({ student }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900 uppercase'>
        {student.matricNo}
      </td>

      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.fullName}
      </td>

      <td className='px-6 py-4 whitespace-nowrap'>
        <StatusBadge status={student.status} />
      </td>

      <td className='px-6 py-4 text-sm text-gray-700'>
        {student.timeMarked ? (
          <span className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            {formatTime(student.timeMarked)}
          </span>
        ) : (
          <span className='text-gray-400'>-</span>
        )}
      </td>
    </tr>
  );
}

LecturerSessionAttendanceRow.propTypes = {
  student: PropTypes.object.isRequired,
};

export default LecturerSessionAttendanceRow;