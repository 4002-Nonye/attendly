import PropTypes from 'prop-types';

function EmptyCard({
  children,
  message,
  title,
  icon: Icon,
  iconColor,
  iconBg,
  wrapperClassName,
  iconClass,
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-12 ${wrapperClassName}`}
    >
      <div className='max-w-md mx-auto text-center flex flex-col justify-center items-center '>
        <div
          className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          {Icon && <Icon className={`w-7 h-7 ${iconColor} ${iconClass}`} />}
        </div>
        <h3 className=' lg:text-xl font-semibold text-gray-900 mb-1.5'>
          {title}
        </h3>
        <p className='text-sm text-gray-600 mb-6'>{message}</p>
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
  iconClass: PropTypes.string,
};

export default EmptyCard;
