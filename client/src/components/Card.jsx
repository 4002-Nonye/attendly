import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Card({ color, link, label, value, icon: Icon, isLink = true }) {
  const content = (
    <div
      className={`flex ${
        isLink ? 'flex-col' : 'flex-col md:flex-row-reverse justify-between'
      }`}
    >
      <div className='flex items-center justify-between mb-4'>
        <div
          className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          {Icon && <Icon className='w-6 h-6' />}
        </div>
        {isLink && (
          <ArrowRight className='w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all' />
        )}
      </div>
      <div>
        <h3 className='text-gray-600 text-sm font-medium mb-1'>{label}</h3>
        <p className='text-2xl md:text-3xl font-bold text-gray-900'>{value}</p>
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link
        to={link}
        className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all group'
      >
        {content}
      </Link>
    );
  }

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      {content}
    </div>
  );
}

Card.propTypes = {
  color: PropTypes.string.isRequired,
  link: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  isLink: PropTypes.bool,
};

export default Card;