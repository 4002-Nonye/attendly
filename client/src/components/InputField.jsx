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

  // if input is for password, handle type, else, use default type
  const inputType = isPassword ? (visible ? 'text' : 'password') : type;
  return (
    <>
      {label && <label htmlFor={htmlFor}>{label}</label>}

      <div className='relative'>
        {Icon && (
          <Icon className='absolute top-5 left-3 text-gray-400 text-xl font-extrabold' />
        )}
        <input
          type={inputType}
          name={htmlFor}
          id={htmlFor}
          placeholder={placeholder}
          autoComplete={autoComplete}
          { ...rest}
        />

        {/* ONLY SHOW EYE ICONS IF INPUT IS A PASSWORD TYPE */}
        {isPassword &&
          // TOGGLE PASSWORD VISIBILITY
          (visible
            ? EyesOff && (
                <EyesOff
                  className='absolute right-3 text-lg top-5 text-gray-500 cursor-pointer'
                  onClick={toggle}
                />
              )
            : EyesOn && (
                <EyesOn
                  className='absolute right-3 text-lg top-5 text-gray-500 cursor-pointer'
                  onClick={toggle}
                />
              ))}
      </div>
    </>
  );
}

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.elementType,
  htmlFor: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete:PropTypes.string,
  eyesOff: PropTypes.elementType,
  eyesOn: PropTypes.elementType,
};

export default InputField;
