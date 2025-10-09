import PropTypes from 'prop-types';

function FormHeader({ text }) {
  return <h2 className='text-xl md:text-2xl font-medium mb-8 '>{text}</h2>;
}

FormHeader.propTypes = {
  text: PropTypes.string,
};
export default FormHeader;
