import PropTypes from 'prop-types';

function Box({ children, className = '', direction = 'flex-col' }) {
  return (
    <div className={`flex ${direction} space-y-2 w-full ${className}`}>
      {children}
    </div>
  );
}

Box.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  direction: PropTypes.string,
};

export default Box;
