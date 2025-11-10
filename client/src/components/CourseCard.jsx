import PropTypes from 'prop-types';
import { getBadgeColor, getStatusStyle } from '../utils/courseHelpers';
import Button from './Button';
import { ClipLoader } from 'react-spinners';
import { Children } from 'react';

function CourseCard({
  course,
  children,
}) {
  const badgeColor = getBadgeColor(course.level);
  const statusStyle = getStatusStyle(course.sessionStatus);

  return (
    <div className='group bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all flex flex-col capitalize'>
      {/* Header */}
      <div className='mb-4'>
        <div className='flex items-start justify-between gap-2 mb-2'>
          <h3 className='font-semibold text-sm text-gray-900 leading-tight'>
            {course.courseTitle}
          </h3>

          <span
            className={`text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded border ${badgeColor}`}
          >
            {course.courseCode}
          </span>
        </div>

        <p className='text-xs text-gray-500'>{course.department?.name}</p>
      </div>

      {/* Stats */}
      <div className='flex flex-wrap items-center gap-2 text-xs mb-4 pb-4 border-b border-gray-100 text-gray-500'>
        <span>
          <span className='font-semibold text-gray-900'>{course.level}</span>{' '}
          Level
        </span>
        <span>•</span>
        <span>
          <span className='font-semibold text-gray-900'>{course.unit}</span>{' '}
          Unit
          {course.unit > 1 ? 's' : ''}
        </span>
        <span>•</span>

        <span className='flex items-center gap-1.5'>
          <span
            className={`inline-flex items-center text-xs  ${statusStyle}`}
          >
            {course.sessionStatus}
          </span>
        </span>
      </div>
      {children}


    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object,
  
  children: PropTypes.node,
};

export default CourseCard;
