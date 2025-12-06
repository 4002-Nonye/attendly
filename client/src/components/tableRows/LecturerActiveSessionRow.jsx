import { Clock } from 'lucide-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import { formatTime } from '../../utils/dateHelper';
import Button from '../Button';

function LecturerActiveSessionRow({ session, onEndSession, isEnding }) {
  return (
    <tr className='hover:bg-gray-50'>
      {/* ID */}
      <td className='px-6 py-4'>
        <Link
          to={`/sessions/${session._id}`}
          className='text-sm font-medium text-blue-600 hover:underline'
          title='View session details & QR code'
        >
          #{session._id.slice(-6).toUpperCase()}
        </Link>
      </td>

      {/* Course */}
      <td className='px-6 py-4'>
        <div>
          <div className='text-sm font-semibold text-gray-900 uppercase'>
            {session.course.courseCode}
          </div>
          <div className='text-sm text-gray-600 capitalize'>
            {session.course.courseTitle}
          </div>
        </div>
      </td>

      {/* Status */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-2'>
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
          </span>
          <span className='text-sm font-medium text-green-700 capitalize'>
            {session.status}
          </span>
        </div>
      </td>

      {/* Started By */}
      <td className='px-6 py-4'>
        <div className='text-sm font-medium text-gray-900'>
          {session.startedBy.fullName}
        </div>
      </td>

      {/* Started At */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-1.5 text-sm text-gray-700'>
          <Clock size={16} className='text-gray-400' />
          {formatTime(session.createdAt)}
        </div>
      </td>

      {/* Actions */}
      <td className='px-6 py-4'>
        <Button
          variant='danger'
          size='sm'
          disabled={isEnding}
          className='capitalize whitespace-nowrap w-30'
          onClick={() => onEndSession(session._id)}
        >
          {isEnding ? <ClipLoader size={22} color='#fff' /> : 'End session'}
        </Button>
      </td>
    </tr>
  );
}

LecturerActiveSessionRow.propTypes = {
  session: PropTypes.object.isRequired,
  onEndSession: PropTypes.func.isRequired,
  isEnding: PropTypes.bool.isRequired,
};

export default LecturerActiveSessionRow;