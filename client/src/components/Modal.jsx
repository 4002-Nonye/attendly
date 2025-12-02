import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import Button from './Button';

function Modal({
  isOpen = true,
  onClose,
  title,
  children,
  size = 'lg',
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  variant = 'drawer', // 'drawer' or 'center'
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  // close modal when ESC is pressed
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // trigger animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      document.body.style.overflow = 'unset';
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Drawer size classes
  const drawerSizeClasses = {
    sm: 'w-full md:w-80',
    md: 'w-full md:w-96',
    lg: 'w-full md:w-[32rem]',
    xl: 'w-full md:w-[40rem]',
    '2xl': 'w-full md:w-[48rem]',
    '3xl': 'w-full md:w-[56rem]',
    '4xl': 'w-full md:w-[64rem]',
    full: 'w-full',
  };

  // Center modal size classes
  const centerSizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const handleOutsideClick = () => {
    if (closeOnOutsideClick) {
      onClose();
    }
  };

  // Drawer variant (slide from left)
  if (variant === 'drawer') {
    return (
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleOutsideClick}
      >
        <div
          className={`fixed left-0 top-0 h-full bg-white shadow-2xl ${drawerSizeClasses[size]} flex flex-col transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              {title && (
                <h3 className='text-xl font-bold text-gray-900 uppercase'>{title}</h3>
              )}
              {showCloseButton && (
                <Button
                  onClick={onClose}
                  variant='outline'
                  className='border-none ml-auto'
                  type='button'
                >
                  <X className='w-5 h-5 text-gray-500' />
                </Button>
              )}
            </div>
          )}

          {/* Content - Scrollable */}
          <div className='flex-1 overflow-y-auto lg:p-6 p-3' >{children}</div>
        </div>
      </div>
    );
  }

  // Center variant (traditional modal)
  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl ${centerSizeClasses[size]} w-full transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            {title && (
              <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
            )}
            {showCloseButton && (
              <Button
                onClick={onClose}
                variant='outline'
                className='border-none ml-auto'
                type='button'
              >
                <X className='w-5 h-5 text-gray-500' />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className='p-6 '>{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  variant: PropTypes.oneOf(['drawer', 'center']),
};

export default Modal;