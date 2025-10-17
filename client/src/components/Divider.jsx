import PropTypes from 'prop-types';

function Divider({ text }) {
  return (
    <div className='flex items-center mb-5'>
      <hr className='flex-grow border-t border-gray-300' />
      {text && (
        <span className='mx-3 text-gray-500 font-medium text-sm'>{text}</span>
      )}
      <hr className='flex-grow border-t border-gray-300' />
    </div>
  );
}

Divider.propTypes = {
  text: PropTypes.string,
};

export default Divider;
