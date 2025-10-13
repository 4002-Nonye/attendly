function Select({
  htmlFor,
  label,
  placeHolder = '',
  data = [],
  labelClassName = '',
  selectClassname = '',
  onChange,
  valueKey = '_id',
  labelKey = 'schoolName',
  ...rest
}) {
  return (
    <>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`block text-sm font-medium mb-2 text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <select
        id={htmlFor}
        onChange={onChange}
        className={`border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer py-4 ${selectClassname}`}
        {...rest}
      >
        <option value=''>{placeHolder}</option>
        {data.map((item) => (
          <option key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </option>
        ))}
      </select>
    </>
  );
}

export default Select;
