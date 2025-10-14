import PropTypes from 'prop-types';

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

      <select
        id={htmlFor}
        className={`border border-gray-300 rounded-md p-2 w-full focus:outline-none text-gray-500  focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer py-4 ${selectClassname}`}
        {...rest}
      >
        <option value=''>{placeHolder}</option>

        {data?.map((item) => {
          return (
            <option key={item[valueKey]} value={item[valueKey]}>
              {item[labelKey]}
            </option>
          );
        })}
      </select>
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
