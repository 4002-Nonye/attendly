import PropTypes from 'prop-types';

import { useButtonState } from '../hooks/useButtonState';

import Select from './Select';

function FilterBar({
  filters,
  hasActiveFilters,
  clearFilters,
  onFilterChange,
}) {
  const { disableButton } = useButtonState();
  return (
    <>
      {filters.map((filter) => (
        <Select
          key={filter.htmlFor}
          htmlFor={filter.htmlFor}
          labelKey={filter.labelKey || 'name'}
          valueKey={filter.valueKey || '_id'}
          value={filter.value}
          placeHolder={filter.placeHolder}
          data={filter.data || []}
          disabled={disableButton}
          label={filter.label}
          onChange={(e) => onFilterChange(filter.name, e.target.value)}
          {...filter.props}
        />
      ))}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className='text-left pl-2 mt-2 text-sm text-gray-600 hover:text-gray-900 underline'
        >
          Clear filters
        </button>
      )}
    </>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasActiveFilters: PropTypes.bool,
  clearFilters: PropTypes.func,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
