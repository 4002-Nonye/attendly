import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const messages = {
  admin: {
    title: 'School Academic Setup Required',
    description:
      "You haven't set the academic year or semester for your school yet. Some features have been temporarily disabled.",
  },
  lecturer: {
    title: 'Academic Session Not Set',
    description:
      'The academic year or semester have not been configured yet. Please contact your administrator to enable all features.',
  },
  student: {
    title: 'Academic Session Not Available',
    description:
      'The current academic year or semester have not been set up yet. Course registration will be available once your school administrator completes the setup.',
  },
};

function AcademicSetupAlert({ role = 'student' }) {
  const { title, description } = messages[role] || messages.student;

  return (
    <div className='bg-yellow-50 border-b border-yellow-200 px-8 py-3'>
      <div className='flex items-center gap-3'>
        <AlertCircle className='text-yellow-600 flex-shrink-0' size={20} />
        <div className='flex-1'>
          <p className='text-sm text-yellow-800 font-medium'>{title}</p>
          <p className='text-xs text-yellow-700 mt-0.5'>{description}</p>
        </div>
      </div>
    </div>
  );
}

AcademicSetupAlert.propTypes = {
  role: PropTypes.oneOf(['admin', 'lecturer', 'student']).isRequired,
};

export default AcademicSetupAlert;