import PropTypes from 'prop-types';

function StudentRow({ student }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <span className='text-sm font-medium capitalize text-gray-900'>
          {student.fullName}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 uppercase'>
        {student.matricNo}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>{student.email}</td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.faculty?.name}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.department?.name}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>{student.level}L</td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {student.coursesTotal}
      </td>
    </tr>
  );
}

StudentRow.propTypes = {
  student: PropTypes.object.isRequired,
};

export default StudentRow;