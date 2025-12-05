import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

import Button from './Button';

function BackButton({ navigate, text, className }) {
  return (
  
    <Button
      onClick={() => navigate(-1)}
      className={`inline-flex bg-white shadow-md py-1 items-center gap-2 text-gray-600 hover:text-gray-900  ${className}`}
    >
      <ArrowLeft size={18} />
      <span className='font-medium'>{text}</span>
    </Button>
  );
}

BackButton.propTypes = {
  navigate: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default BackButton;
