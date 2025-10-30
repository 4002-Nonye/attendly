import PropTypes from 'prop-types';
import { AlertTriangle, X } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Button from './Button';
import Modal from './Modal';

function ConfirmDeletDialog({
  onClose,
  onConfirm,
  title,
  isDeleting,
  message,
}) {
  return (
    <Modal onClose={onClose}>
     
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
        </div>
      </div>

      
      <div className='mb-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-sm font-semibold text-red-800 flex items-center gap-2'>
            <AlertTriangle className='w-4 h-4' />
            Warning
          </p>
          <p className='text-sm text-red-700 mt-2'>{message}</p>
        </div>
      </div>

      {/* CTA */}
      <div className='flex gap-3 justify-end'>
        <Button
          type='button'
          variant='secondary'
          size='md'
          className='w-26'
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type='button'
          size='md'
          onClick={onConfirm}
          disabled={isDeleting}
          variant='danger'
          className='w-26'
        >
          {isDeleting ? <ClipLoader size={16} color='white' /> : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}

ConfirmDeletDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmDeletDialog;
