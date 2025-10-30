import PropTypes from 'prop-types';

function EmptyCard({
  children,
  message,
  title,
  icon: Icon,
  iconColor,
  iconBg,
  wrapperClassName,
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-12 ${wrapperClassName}`}
    >
      <div className='max-w-md mx-auto text-center flex flex-col justify-center items-center '>
        <div
          className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {Icon && <Icon className={`w-8 h-8 ${iconColor}`} />}
        </div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>{title}</h3>
        <p className='text-gray-600 mb-6'>{message}</p>
        {children}
      </div>
    </div>
  );
}

EmptyCard.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
  iconBg: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export default EmptyCard;
