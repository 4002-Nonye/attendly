import { Clock, Eye, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';

import { formatTime } from '../utils/dateHelper';

function SessionsCard({ session, children }) {
  
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all flex flex-col h-full'>
      {/* Header - Course Info */}
      <div className='mb-4'>
        <div className='flex items-start justify-between gap-3 mb-2'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-base font-bold text-gray-900 uppercase truncate'>
              {session.course.courseCode}
            </h3>
          </div>

          {/*  Status  */}
          <div className='flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full'>
            <span className='relative flex h-1.5 w-1.5'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500'></span>
            </span>
            <span className='text-xs font-semibold text-green-700 capitalize'>
              {session.status}
            </span>
          </div>
        </div>
        <p className='text-sm text-gray-600 capitalize'>
          {session.course.courseTitle}
        </p>
      </div>

      {/*Started By & Time */}
      <div className='flex-grow my-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Started By
            </p>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {session.startedBy.fullName}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
              Started At
            </p>
            <div className='flex items-center gap-1.5'>
              <Clock size={14} className='text-gray-400' />
              <p className='text-sm font-medium text-gray-900'>
                {formatTime(session.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

SessionsCard.propTypes = {
  session: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func,
  onEndSession: PropTypes.func,
};

export default SessionsCard;
