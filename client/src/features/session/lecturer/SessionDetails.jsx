import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '../../../components/Button';
import { useSessionDetail } from './useSessionDetails';
import SessionCourseInfo from '../../../components/SessionCourseInfo';
import SessionInfo from '../../../components/SessionInfo';
import SessionQRCodeCard from '../../../components/SessionQRCodeCard';

function SessionDetailsPage() {
  const { id: sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // get data from navigation state
  const initialSessionData = location.state?.sessionData;

  const { data, isPending } = useSessionDetail(sessionId, {
    enabled: !initialSessionData,
  });

  // use initial data or fetched data
  const session = data?.session || initialSessionData;

  if (isPending && !initialSessionData) {
    return ' <LoadingSpinner />';
  }
  if (!session)
    return <p className='text-center text-gray-500'>Session not found</p>;

  return (
    <div className='w-full '>
      {/* Header */}
      <Button
        onClick={() => navigate('/sessions')}
        className='inline-flex bg-white shadow-md py-1 items-center gap-2 text-gray-600 hover:text-gray-900 mb-7'
      >
        <ArrowLeft size={18} />
        <span className='text-sm font-medium'> Go Back</span>
      </Button>

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - Course & Session Info */}
        <div className='lg:col-span-2 space-y-6'>

          {/* Course Information */}
          <SessionCourseInfo course={session.course} />

          {/* Session Details */}
          <SessionInfo session={session} />

        </div>

        {/* Right Column - QR Code */}
        <SessionQRCodeCard session={session} />
      </div>
    </div>
  );
}

export default SessionDetailsPage;
