import PropTypes from 'prop-types';

function Avatar({ fullName, className = 'w-12 h-12' }) {
const profilePhoto = `https://ui-avatars.com/api/?name=${fullName}&size=200&background=d97706&color=fff&bold=true`;
  return (
    <div>
      <img
        src={profilePhoto}
        alt={fullName}
        className={`${className} rounded-full object-cover border-4 border-blue-100`}
      />
    </div>
  );
}
Avatar.propTypes = {
  fullName: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};
export default Avatar;
