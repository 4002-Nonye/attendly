import PropTypes from 'prop-types';
import { usePasswordToggle } from '../hooks/usePasswordToggle';

function InputField({
  label = '',
  type = 'text',
  icon: Icon,
  htmlFor = '',
  placeholder = '',
  autoComplete,
  eyesOff: EyesOff,
  eyesOn: EyesOn,
  ...rest
}) {
  const isPassword = htmlFor === 'password' || type === 'password';
  const { toggle, visible } = usePasswordToggle();
  const inputType = isPassword ? (visible ? 'text' : 'password') : type;

  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && (
        <label
          htmlFor={htmlFor}
          className='text-sm font-medium text-gray-500 '
        >
          {label}
        </label>
      )}

      <div className='relative flex items-center'>
        {Icon && (
          <Icon
            size={20}
            className='absolute left-3 text-gray-400 pointer-events-none'
          />
        )}

        <input
          type={inputType}
          name={htmlFor}
          id={htmlFor}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={` py-4 rounded-lg border border-gray-300 ${
            Icon ? 'px-10' : 'px-4'
          }`}
          {...rest}
        />

        {isPassword &&
          (visible
            ? EyesOff && (
                <EyesOff
                  size={20}
                  className='absolute right-3 text-gray-400 cursor-pointer'
                  onClick={toggle}
                />
              )
            : EyesOn && (
                <EyesOn
                  size={20}
                  className='absolute right-3 text-gray-400 cursor-pointer'
                  onClick={toggle}
                />
              ))}
      </div>
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.elementType,
  htmlFor: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  eyesOff: PropTypes.elementType,
  eyesOn: PropTypes.elementType,
};

export default InputField;
