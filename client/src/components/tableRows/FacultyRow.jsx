import { Edit, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

function FacultyRow({ faculty, onEdit, onDelete }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <span className='text-sm font-medium capitalize text-gray-900'>
          Faculty <span className='lowercase'>of</span> {faculty.name}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalDepartments}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalCourses}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalLecturers}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {faculty.totalStudents}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => onEdit(faculty)}
            className='text-blue-500 hover:text-blue-700 transition-colors'
            title='Edit faculty'
          >
            <Edit size={20} />
          </button>
          <button
            type='button'
            onClick={() => onDelete(faculty)}
            className='text-red-500 hover:text-red-700 transition-colors'
            title='Delete faculty'
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}

FacultyRow.propTypes = {
  faculty: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FacultyRow;