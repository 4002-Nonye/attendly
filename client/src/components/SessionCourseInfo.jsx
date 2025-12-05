import { BookOpen } from 'lucide-react';
import PropTypes from 'prop-types';

import InfoBox from './InfoBox';

export default function SessionCourseInfo({ course }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <BookOpen className='text-blue-600' size={24} />
        <h2 className='text-lg font-bold text-gray-900'>Course Information</h2>
      </div>

      <div className='space-y-4'>
        <div>
          <div className='text-lg font-bold text-gray-900 uppercase mb-1'>
            {course.courseCode}
          </div>
          <div className='text-base text-gray-700 capitalize'>
            {course.courseTitle}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-200'>
          <InfoBox label='Department' value={course.department.name} />
          <InfoBox
            label='Faculty'
            value={`Faculty of ${course.faculty.name}`}
          />
          <InfoBox label='Level' value={`${course.level}L`} />
          <InfoBox
            label='Credit Units'
            value={`${course.unit} ${course.unit === 1 ? 'Unit' : 'Units'}`}
          />
        </div>
      </div>
    </div>
  );
}

SessionCourseInfo.propTypes = {
  course: PropTypes.object.isRequired,
};
