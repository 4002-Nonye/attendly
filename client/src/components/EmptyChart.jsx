import PropTypes from 'prop-types';
import { BarChart3 } from 'lucide-react';

function EmptyChart({ message = 'No data available', subMessage, icon: Icon }) {
  return (
    <div className='h-64 flex flex-col items-center  justify-center text-gray-400'>
      {Icon ? (
        <Icon className='w-16 h-16 mb-4' />
      ) : (
        <BarChart3 className='w-16 h-16 mb-4' />
      )}
      <p className='text-sm font-medium'>{message}</p>
      {subMessage && <p className='text-xs mt-1 text-center'>{subMessage}</p>}
    </div>
  );
}

EmptyChart.propTypes = {
  message: PropTypes.string,
  subMessage: PropTypes.string,
  icon: PropTypes.elementType,
};

export default EmptyChart;
