
import PropTypes from 'prop-types';
import Button from './Button';


function ReportButton({ courseId, isPending, navigate }) {
  return (
    <Button
      variant='primary'
      size='sm'
      onClick={() => navigate(`/lecturer/attendance/report/${courseId}`)}
      disabled={isPending}
    >
      <span className='inline'>View Report</span>
    </Button>
  );
}

ReportButton.propTypes = {
  courseId: PropTypes.string.isRequired,
  isPending: PropTypes.bool,              
  navigate: PropTypes.func.isRequired,
};

ReportButton.defaultProps = {
  isPending: false,
};

export default ReportButton;
