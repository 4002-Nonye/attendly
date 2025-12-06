import PropTypes from 'prop-types';

import { getStatusBadge } from '../utils/courseHelpers';

function StatusBadge({ status }) {

  const config = getStatusBadge(status);
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon className='w-3 h-3' />
      {config.label}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
