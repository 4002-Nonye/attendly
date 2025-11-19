
import PropTypes from 'prop-types';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

function Alert({ 
  type = 'warning', 
  icon: CustomIcon,
  title,
  message, 
  children,
  className = '',
  showBorder = false,
  size = 'md'
}) {

  //  icons for each type
  const defaultIcons = {
    warning: AlertCircle,
    error: XCircle,
    success: CheckCircle,
    info: Info,
  };


  const typeStyles = {
    warning: {
      container: 'bg-yellow-50 text-yellow-700',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
    },
    error: {
      container: 'bg-red-50 text-red-700',
      border: 'border-red-200',
      icon: 'text-red-600',
    },
    success: {
      container: 'bg-green-50 text-green-700',
      border: 'border-green-200',
      icon: 'text-green-600',
    },
    info: {
      container: 'bg-blue-50 text-blue-700',
      border: 'border-blue-200',
      icon: 'text-blue-600',
    },
  };

  const sizeStyles = {
    sm: {
      container: 'p-2 rounded-md',
      icon: 'w-3.5 h-3.5',
      title: 'text-xs',
      message: 'text-xs',
    },
    md: {
      container: 'p-3 rounded-lg',
      icon: 'w-4 h-4',
      title: 'text-sm',
      message: 'text-sm',
    },
    lg: {
      container: 'p-4 rounded-lg',
      icon: 'w-5 h-5',
      title: 'text-base',
      message: 'text-sm',
    },
  };

  const styles = typeStyles[type] || typeStyles.warning;
  const sizes = sizeStyles[size] || sizeStyles.md;
  const Icon = CustomIcon || defaultIcons[type];

  const borderClass = showBorder ? `border ${styles.border}` : '';

  return (
    <div 
      className={`flex items-start gap-2 ${styles.container} ${sizes.container} ${borderClass} ${className}`}
    >
      {Icon && (
        <Icon className={`${sizes.icon} ${styles.icon} mt-0.5 flex-shrink-0`} />
      )}
      <div className='flex-1'>
        {title && (
          <p className={`font-medium ${sizes.title} mb-0.5`}>{title}</p>
        )}
        {message && (
          <p className={sizes.message}>{message}</p>
        )}
        {children}
      </div>
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(['warning', 'error', 'success', 'info']),
  icon: PropTypes.elementType,
  title: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  className: PropTypes.string,
  showBorder: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Alert;
