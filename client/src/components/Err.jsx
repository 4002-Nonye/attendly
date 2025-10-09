import PropTypes from 'prop-types';

function Err({ msg, className }) {
  return (
    <p
      className={`text-red-500 text-sm  italic min-h-[1.2rem] ${className}`}
    >
      {msg}
    </p>
  );
}

Err.propTypes = {
  msg: PropTypes.string,
  className: PropTypes.string,
};
export default Err;
