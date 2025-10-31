import PropTypes from 'prop-types';
import clsx from 'clsx';

function Button({
  children,
  type = 'button',
  variant = '',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  icon: Icon,
  className = '',
  iconPosition = 'beforeText',
  active = false,
}) {
  const baseStyles =
    'flex items-center justify-center font-medium rounded-lg transition-all duration-500 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed ';

  const variantStyles = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 ',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 ',
    danger: 'bg-red-600 text-white hover:bg-red-700 ',
    outline:
      'border-2 border-gray-300 hover:bg-gray-100 ',
    pill: active
      ? 'bg-white text-blue-700 shadow-sm'
      : 'bg-transparent text-gray-600 hover:text-gray-900',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-4 text-base',
  };

  const buttonClass = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={buttonClass}
    >
      {iconPosition === 'beforeText' && Icon && (
        <Icon className='mr-2' size={20} />
      )}
      {children}
      {iconPosition === 'afterText' && Icon && (
        <Icon className='ml-2' size={20} />
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'pill']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  iconPosition: PropTypes.oneOf(['beforeText', 'afterText']),
  active: PropTypes.bool,
};

export default Button;