import { Calendar, Clock, PlayCircle, User } from 'lucide-react';
import PropTypes from 'prop-types';

import { formatTime, formatYear } from '../utils/dateHelper';

import InfoBox from './InfoBox';

export default function SessionInfo({ session }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Calendar className='text-blue-600' size={24} />
        <h2 className='text-xl font-bold text-gray-900'>Session Details</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <InfoBox
          icon={Calendar}
          label='Date'
          value={formatYear(session.createdAt)}
        />
        <InfoBox
          icon={Clock}
          label='Time'
          value={formatTime(session.createdAt)}
        />

        <InfoBox
          icon={User}
          label='Created By'
          value={session.startedBy.fullName}
        />
        <InfoBox icon={PlayCircle} label='Status' value={session.status} />
      </div>
    </div>
  );
}

SessionInfo.propTypes = {
  session: PropTypes.object.isRequired,
};
