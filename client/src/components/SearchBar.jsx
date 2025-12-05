import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

import InputField from './InputField';

function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  disabled,
}) {



  return (
    <div className={`relative w-full md:w-2/4  ${className}`}>
      <InputField
        icon={Search}
        id='input'
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className='w-full pl-10 '
      />
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default SearchBar;
