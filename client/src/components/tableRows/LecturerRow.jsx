import PropTypes from 'prop-types';

function LecturerRow({ lecturer }) {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <span className='text-sm font-medium capitalize text-gray-900'>
          {lecturer.fullName}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>{lecturer.email}</td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {lecturer.faculty.name}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {lecturer.department?.name}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {lecturer.coursesTotal}
      </td>
    </tr>
  );
}

LecturerRow.propTypes = {
  lecturer: PropTypes.object.isRequired,
};

export default LecturerRow;