import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

function QuickActions({ title = 'Quick Actions', actions = [] }) {
  const navigate = useNavigate();
  if (!actions.length) return null;

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6'>
      <h3 className='text-base lg:text-lg font-semibold text-gray-900 mb-4'>
        {title}
      </h3>
      <div className='flex flex-wrap gap-3'>
        {actions.map(
          (
            {
              to,
              label,
              icon: Icon,
              variant = 'primary',
              size = 'sm',
            },
            index
          ) => (
            <Button
              key={index}
              variant={variant}
              icon={Icon}
              size={size}
              onClick={()=>navigate(to)}
            >
              {label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

QuickActions.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
      size: PropTypes.oneOf(['sm', 'md', 'lg']),
    })
  ),
};

export default QuickActions;
