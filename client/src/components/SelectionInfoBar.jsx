import PropTypes from "prop-types";

function SelectionInfoBar({ count, onClear }) {
  if (count === 0) return null;

  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between'>
      <span className='text-sm text-blue-800 font-medium'>
        {count} course{count > 1 ? 's' : ''} selected
      </span>

      {onClear && (
        <button
          onClick={onClear}
          className='text-sm text-blue-600 hover:text-blue-800 underline'
        >
          Clear selection
        </button>
      )}
    </div>
  );
}

SelectionInfoBar.propTypes={
  count:PropTypes.number.isRequired,
  onClear:PropTypes.func.isRequired
}

export default SelectionInfoBar;
