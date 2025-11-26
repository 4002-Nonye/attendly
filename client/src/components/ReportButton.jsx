import PropTypes from 'prop-types';
import Button from './Button';

function ReportButton({
  courseId,
  isPending = false,
  navigate,
  text = 'View Report',
}) {
  return (
    <Button
      variant='primary'
      size='sm'
      onClick={() => navigate(`/attendance/course/${courseId}/report`)}
      disabled={isPending}
    >
      <span className='inline'>{text}</span>
    </Button>
  );
}

ReportButton.propTypes = {
  courseId: PropTypes.string.isRequired,
  isPending: PropTypes.bool,
  navigate: PropTypes.func.isRequired,
};

export default ReportButton;
