import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

function Select({
  htmlFor,
  label,
  placeHolder = '',
  data = [],
  labelClassName = '',
  selectClassname = '',
  valueKey = '_id',
  labelKey = 'schoolName',
  ...rest
}) {
  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`block text-sm font-medium mb-2 text-gray-500 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div className='relative'>
        <select
          id={htmlFor}
          className={`
          border border-gray-300 rounded-md p-2 w-full
          focus:outline-none focus:ring-2 focus:ring-blue-500
          text-gray-600 text-sm cursor-pointer py-4
          appearance-none bg-white
          ${selectClassname}
        `}
          {...rest}
        >
          <option value=''>{placeHolder}</option>

          {data?.map((item) => (
            <option key={item[valueKey]} value={item[valueKey]}>
              {item[labelKey]}
            </option>
          ))}
        </select>

        {/* Lucide icon (custom dropdown arrow) */}
        <ChevronDown
          size={18}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
        />
      </div>
    </>
  );
}

// Add PropTypes
Select.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeHolder: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  labelClassName: PropTypes.string,
  selectClassname: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string.isRequired,
};

export default Select;
