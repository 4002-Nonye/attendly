
import { Calendar } from 'lucide-react';
import PropTypes from 'prop-types';

const AttendanceSessionInfoCard = ({ course, sessions }) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 capitalize'>
          {course.courseCode} - {course.courseTitle}
        </h3>

      </div>
      <div className='flex items-center gap-2 text-sm'>
        <div className='bg-blue-100 p-2 rounded-lg'>
          <Calendar className='w-5 h-5 text-blue-600' />
        </div>
        <div>
          <p className='font-semibold text-gray-900'>{sessions?.length || 0}</p>
          <p className='text-gray-600 text-xs'>
            {sessions?.length === 1 ? 'Session' : 'Sessions'}
          </p>
        </div>
      </div>
    </div>
  </div>
);

AttendanceSessionInfoCard.propTypes = {
  course: PropTypes.object.isRequired,
  sessions: PropTypes.array.isRequired,
};

export default AttendanceSessionInfoCard;
