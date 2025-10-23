import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getBadgeColor } from '../utils/courseHelpers';

function CourseCard({ course, actionText = 'Start Attendance', actionLink }) {
  const badgeColor = getBadgeColor(course.level);

  return (
    <div className='group bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 hover:border-gray-300 transition-all'>
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
        <p className='text-xs text-gray-500'>
          {course.department?.name || course.department}
        </p>
      </div>

      {/* Stats */}
      <div className='flex items-center gap-4 text-xs mb-4 pb-4 border-b border-gray-100'>
        <div>
          <span className='text-gray-500'>Level </span>
          <span className='font-semibold text-gray-900'>{course.level}</span>
        </div>
        <div>
          <span className='text-gray-500'>{course.totalStudents || 0} </span>
          <span className='text-gray-500'>
            {course.totalStudents === 1 ? 'student' : 'students'}
          </span>
        </div>
        <div>
          <span className='text-gray-500'>{course.totalSessions || 0} </span>
          <span className='text-gray-500'>
            {course.totalSessions === 1 ? 'session' : 'sessions'}
          </span>
        </div>
      </div>

      {/* Action */}
      <Link
        to={actionLink}
        className='flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-100 group-hover:shadow-sm transition-all'
      >
        <span>{actionText}</span>
        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
      </Link>
    </div>
  );
}

export default CourseCard;
