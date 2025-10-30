import PropTypes from 'prop-types';

function Modal({ onClose, title, children }) {
  return (
    <div
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className='text-xl font-bold text-gray-900 mb-4'>{title}</h3>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
