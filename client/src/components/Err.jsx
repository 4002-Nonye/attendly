import PropTypes from "prop-types";

function Err({msg}) {
  return (
    <p className='text-red-500 text-sm mt-1 italic '>
      {msg}
    </p>
  );
}


Err.propTypes={
    msg:PropTypes.string
}
export default Err;
