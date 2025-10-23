import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function SectionIntro({ length = 0, linkTo, title, subTitle, className }) {
  return (
    <div className={`flex items-center justify-between ${className} `}>
      <div>
        <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
        <p className='text-sm text-gray-600 mt-1'>{subTitle}</p>
      </div>
      {length > 0 && (
        <Link
          to={linkTo}
          className='text-sm text-blue-600 hover:underline font-medium'
        >
          View all
        </Link>
      )}
    </div>
  );
}

SectionIntro.propTypes = {
  length: PropTypes.number,
  linkTo: PropTypes.string,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default SectionIntro;
