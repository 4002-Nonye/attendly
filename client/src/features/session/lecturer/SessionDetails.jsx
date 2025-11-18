import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { useSessionDetail } from './useSessionDetails';
import SessionCourseInfo from '../../../components/SessionCourseInfo';
import SessionInfo from '../../../components/SessionInfo';
import SessionQRCodeCard from '../../../components/SessionQRCodeCard';
import EmptyCard from '../../../components/EmptyCard';

import SessionDetailSkeleton from '../../../components/SessionDetailSkeleton';
import BackButton from '../../../components/BackButton';

function SessionDetailsPage() {
  const { id: sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // get data from navigation state
  const initialSessionData = location.state?.sessionData;

  // fetch session data
  const { data, isPending } = useSessionDetail(sessionId, {
    //  disable initial fetch if there is fresh data from creation
    enabled: !initialSessionData,
  });

  // Use initial data or fetched data
  const session = data?.session || initialSessionData;

  if (isPending && !initialSessionData) return <SessionDetailSkeleton />;

  if (!session) {
    return (
      <div className='w-full'>
        <Button
          onClick={() => navigate(-1)}
          className='inline-flex bg-white shadow-md py-1 items-center gap-2 text-gray-600 hover:text-gray-900 mb-7'
        >
          <ArrowLeft size={18} />
          <span className='text-sm font-medium'>Go Back</span>
        </Button>
        <EmptyCard
          icon={AlertCircle}
          iconColor='text-gray-400'
          title='Session Not Found'
          message={`The session you're looking for doesn't exist.`}
          iconClass='w-12 h-12'
        >
          <Button variant='primary' onClick={() => navigate('/sessions')}>
            View All Sessions
          </Button>
        </EmptyCard>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <BackButton navigate={navigate} text='Go Back' />

      {/* Main Grid */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
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
