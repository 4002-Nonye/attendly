import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Button from './Button';
import Modal from './Modal';

function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      closeOnOutsideClick={!isDeleting}
      closeOnEscape={!isDeleting}
      variant='center'
    >
      <div className='mb-6'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-sm font-semibold text-red-800 flex items-center gap-2'>
            <AlertTriangle className='w-4 h-4' />
            Warning
          </p>
          <p className='text-sm text-red-700 mt-2'>{message}</p>
        </div>
      </div>

      {/* Cta */}
      <div className='flex gap-3 justify-end'>
        <Button
          type='button'
          variant='secondary'
          className='w-26'
          size='md'
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type='button'
          variant='danger'
          size='md'
          className='w-26'
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? <ClipLoader size={16} color='white' /> : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}

ConfirmDeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool,
};

export default ConfirmDeleteDialog;
