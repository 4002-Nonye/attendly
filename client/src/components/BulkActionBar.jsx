import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import Button from './Button';
import { ClipLoader } from 'react-spinners';

function BulkActionBar({
  count,
  onClear,
  actionLabel = 'Assign Selected',
  onAction,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  isPending,
}) {
  if (count === 0) return null;

  return (
    <div className='rounded-xl shadow-sm border border-gray-100 p-2 md:p-4 mt-8'>
      <div className='flex flex-row items-center justify-between gap-3'>
        {/* Count info */}
        <div className='text-sm text-gray-600 text-center '>
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
            size='sm'
            onClick={onAction}
            disabled={disabled}
            className='flex items-center gap-2 w-48'
          >
            {isPending ? (
                <ClipLoader size={22} color='white' />
            ) : (
              <>
                {Icon && <Icon size={18} />}
                {actionLabel}
              </>
            )}
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
  isPending: PropTypes.bool,
};

export default BulkActionBar;
