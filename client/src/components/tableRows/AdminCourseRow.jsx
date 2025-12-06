import { Edit, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

function AdminCourseRow({ course, onEdit, onDelete }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div>
          <div className='text-sm font-semibold text-gray-900 uppercase'>
            {course.courseCode}
          </div>
          <div className='text-sm text-gray-600 capitalize'>
            {course.courseTitle}
          </div>
        </div>
      </td>
      <td className='px-6 py-4'>
        <div className='text-sm text-gray-700 capitalize'>
          {course.department?.name}
        </div>
        <div className='text-xs text-gray-500 capitalize'>
          Faculty <span className='lowercase'>of</span> {course.faculty?.name}
        </div>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>{course.level}L</td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {course.unit} {course.unit === 1 ? 'Unit' : 'Units'}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => onEdit(course)}
            className='text-blue-500 hover:text-blue-700 transition-colors'
            title='Edit course'
          >
            <Edit size={20} />
          </button>
          <button
            type='button'
            onClick={() => onDelete(course)}
            className='text-red-500 hover:text-red-700 transition-colors'
            title='Delete course'
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}

AdminCourseRow.propTypes = {
  course: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AdminCourseRow;