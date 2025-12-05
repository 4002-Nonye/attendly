import { BarChart3 } from 'lucide-react';
import PropTypes from 'prop-types';

function EmptyChart({
  message = 'No data available',
  subMessage,
  icon: Icon,
  className,
}) {
  return (
    <div
      className={`h-64  flex flex-col items-center  justify-center ${className} `}
    >
      {Icon ? (
        <Icon className='w-16 h-16 mb-4 text-gray-300' />
      ) : (
        <BarChart3 className='w-16 h-16 mb-4' />
      )}
      <p className='text-sm font-medium text-gray-700'>{message}</p>
      {subMessage && (
        <p className='text-sm mt-1 text-center text-gray-500'>{subMessage}</p>
      )}
    </div>
  );
}

EmptyChart.propTypes = {
  message: PropTypes.string,
  subMessage: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

export default EmptyChart;
