import PropTypes from 'prop-types';

import Button from './Button';

function ChangeRole({ role, onClick }) {
  return (
    <div className='flex items-center justify-between bg-gray-50 rounded-lg py-3 mb-6 px-1.5'>
      <p className='text-sm text-gray-700'>
        You’re signing up as
        <span className='font-semibold capitalize text-gray-900'> {role}</span>
      </p>
      <Button
        variant=''
        type='button'
        size='sm'
        className='font-medium text-blue-800 hover:underline'
        onClick={onClick}
      >
        Change role
      </Button>
    </div>
  );
}
ChangeRole.propTypes = {
  role: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ChangeRole;
