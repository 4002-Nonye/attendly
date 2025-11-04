import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import Button from './Button';

function BulkActionBar({
  count,
  onClear,
  actionLabel = 'Assign Selected',
  onAction,
  icon: Icon ,
  variant = 'primary',
  disabled = false,
}) {
  if (count === 0) return null;

  return (
    <div className='rounded-xl shadow-sm border border-gray-100 p-4 mt-8'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        {/* Count info */}
        <div className='text-sm text-gray-600 text-center sm:text-left'>
          <span className='font-medium text-gray-900'>{count}</span> course
          {count > 1 ? 's' : ''} selected
        </div>

        {/* Actions */}
        <div className='flex items-center gap-3'>
          {onClear && (
            <button
              onClick={onClear}
              className='text-sm text-blue-600 hover:text-blue-800 underline'
            >
              Clear selection
            </button>
          )}

          <Button
            variant={variant}
            size='md'
            onClick={onAction}
            disabled={disabled}
            className='flex items-center gap-2'
          >
            {Icon && <Icon size={18} />}
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

BulkActionBar.propTypes = {
  count: PropTypes.number.isRequired,
  onClear: PropTypes.func,
  onAction: PropTypes.func.isRequired,
  actionLabel: PropTypes.string,
  Icon: PropTypes.elementType,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
};

export default BulkActionBar;
