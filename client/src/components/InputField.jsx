import PropTypes from 'prop-types';

import { usePasswordToggle } from '../hooks/usePasswordToggle';

function InputField({
  label = '',
  type = '',
  icon: Icon,
  htmlFor = '',
  placeholder = '',
  eyesOff: EyesOff,
  eyesOn: EyesOn,
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
          <Icon className='absolute top-5 left-3 text-gray-500 text-lg' />
        )}
        <input
          type={inputType}
          name={htmlFor}
          id={htmlFor}
          placeholder={placeholder}
        />

        {/* ONLY SHOW EYE ICONS IF INPUT IS A PASSWORD TYPE */}
        {isPassword &&
          // TOGGLE PASSWORD VISIBILITY
          (visible
            ? EyesOn && (
                <EyesOn
                  className='absolute right-3 text-lg top-5 text-gray-500 cursor-pointer'
                  onClick={toggle}
                />
              )
            : EyesOff && (
                <EyesOff
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
  eyesOff: PropTypes.elementType,
  eyesOn: PropTypes.elementType,
};

export default InputField;
