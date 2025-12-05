import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

import Alert from './Alert';

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
   <>


    <div className='pb-5' size='lg'>
       <Alert title={title} message={description} icon={AlertCircle}/>

    </div></>
  );
}

AcademicSetupAlert.propTypes = {
  role: PropTypes.oneOf(['admin', 'lecturer', 'student']).isRequired,
};

export default AcademicSetupAlert;