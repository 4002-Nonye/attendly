import { Link } from 'react-router-dom';
import { ArrowRight, Circle } from 'lucide-react';
import { getBadgeColor, getStatusStyle } from '../utils/courseHelpers';

function CourseCard({
  course,
  actionText = 'Start Attendance',
  actionLink,
  showStatus = true,
}) {
  const badgeColor = getBadgeColor(course.level);
  // Get status from course or default to 'Inactive'
  const status = course.status || 'Inactive';
  const statusStyle = getStatusStyle(status);

  return (
    <div className='group bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all flex flex-col'>
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

        <p className='text-xs text-gray-500'>{course.department.name}</p>
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
        {/* Status  */}

        {showStatus && (
          <span className='flex items-center gap-1.5'>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle}`}
            >
             
              {status}
            </span>
          </span>
        )}
      </div>

      {/* Action button */}
      <Link
        to={actionLink}
        className='flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-medium text-sm bg-blue-900 text-white hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 transition-all mt-auto'
      >
        <span>{actionText}</span>
        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
      </Link>
    </div>
  );
}

export default CourseCard;
