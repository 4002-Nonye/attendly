import PropTypes from 'prop-types';

function InfoBox({ label, value, icon: Icon }) {
  return (
    <div
      className={` ${
        Icon && 'flex items-start gap-3 p-4 bg-gray-50 rounded-lg'
      }`}
    >
      {Icon && <Icon className='text-gray-500 mt-0.5' size={20} />}
      <div>
        <p className='text-sm text-gray-500 mb-1'>{label}</p>
        <p className='text-sm font-medium text-gray-900 capitalize'>{value}</p>
      </div>
    </div>
  );
}

InfoBox.propTypes = {
  label: PropTypes.string.isRequired,
  Icon: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default InfoBox;
