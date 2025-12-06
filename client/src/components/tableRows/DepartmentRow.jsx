import { Edit, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

function DepartmentRow({ department, onEdit, onDelete }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div className='text-sm text-gray-700 capitalize'>
          {department.name}
        </div>
        <div className='text-xs text-gray-500 capitalize'>
          Faculty <span className='lowercase'>of</span>{' '}
          {department.faculty.name}
        </div>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {String(department.maxLevel)[0]}-year
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {department.totalCourses}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {department.totalLecturers}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {department.totalStudents}
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-start gap-3'>
          <button
            type='button'
            onClick={() => onEdit(department)}
            className='text-blue-500 hover:text-blue-700 transition-colors'
            title='Edit department'
          >
            <Edit size={20} />
          </button>
          <button
            type='button'
            onClick={() => onDelete(department)}
            className='text-red-500 hover:text-red-700 transition-colors'
            title='Delete department'
          >
            <Trash2 size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}

DepartmentRow.propTypes = {
  department: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DepartmentRow;

