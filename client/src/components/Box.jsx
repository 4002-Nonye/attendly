import PropTypes from 'prop-types';

function Box({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-2 w-full ${className}`}>
      {children}
    </div>
  );
}

Box.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Box;
