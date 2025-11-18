import PropTypes from "prop-types";

function AttendanceCourseInfoSkeleton({ height = 96 }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 animate-pulse'>
      <div
        className='bg-gray-100 rounded-md w-full'
        style={{ height }}
      />
    </div>
  );
}

AttendanceCourseInfoSkeleton.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,   // height in pixels
    PropTypes.string,   // "50%", "10rem", "120px", etc.
  ]),
};

export default AttendanceCourseInfoSkeleton;
