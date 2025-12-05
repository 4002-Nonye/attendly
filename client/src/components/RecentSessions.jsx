import { Calendar, CheckCircle2,Clock } from 'lucide-react';

import { useRecentSession } from '../features/dashboard/general/useRecentSession';
import { getStatusStyle } from '../utils/courseHelpers';
import {formatTime,formatYear} from '../utils/dateHelper'

import DataTable from './DataTable';
import EmptyChart from './EmptyChart';
import SectionIntro from './SectionIntro';
import TableSkeleton from './skeletons/TableSkeleton';

function RecentSessions() {
  const { data, isPending } = useRecentSession();
  const recentSessions = data?.sessions || [];

  const columns = [
    'Course',
    'Started By',
    'Ended By',
    'Date & Time',
    'Status',
  ];

  const renderRow = (session) => {
    const statusStyle = getStatusStyle(session.status || 'inactive');

    return (
      <tr key={session.id} className='hover:bg-gray-50 transition-colors'>
        <td className='px-6 py-4 whitespace-nowrap'>
          <div>
            <div className='text-sm font-medium text-gray-900 capitalize'>
              {session.course}
            </div>
            <div className='text-sm text-gray-500'>{session.courseCode}</div>
          </div>
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
          {session.startedBy}
        </td>

        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
          {session.status === 'active'
            ? 'In progress'
            : session.endedBy || 'Not known'}
        </td>

        <td className='px-6 py-4 whitespace-nowrap'>
          <div className='flex items-center gap-2 text-sm text-gray-900'>
            <Calendar className='w-4 h-4 text-gray-400' />
            <span>
              {formatYear(session.createdAt,'short')}

            </span>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>
            <Clock className='w-4 h-4 text-gray-400' />
            <span>
                {formatTime(session.createdAt)}

            </span>
          </div>
        </td>

    

        <td className='px-6 py-4 whitespace-nowrap text-xs'>
          {session.status === 'active' ? (
            <span
              className={`${statusStyle} inline-flex items-center gap-1 `}
            >
              <div className='w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse' />
              Active
            </span>
          ) : (
            <span
              className={`${statusStyle} inline-flex items-center gap-1 `}
            >
              <CheckCircle2 className='w-3 h-3 text-gray-500' />
              Ended
            </span>
          )}
        </td>
      </tr>
    );
  };

  if (isPending) return <TableSkeleton />;

  return (
    <>
      {!recentSessions.length ? (
        <EmptyChart
          icon={Calendar}
          message='No recent sessions found'
          subMessage='Sessions will appear here once created'
          iconColor='w-8 h-8 mb-4 text-gray-300'
          className='bg-white rounded-xl shadow-sm border border-gray-100 p-12 mb-8 h-96'
        />
      ) : (
        <DataTable
          columns={columns}
          renderRow={renderRow}
          data={recentSessions}
        >
          <div className='p-6 border-b border-gray-100'>
            <SectionIntro
              title='Recent Class Sessions'
              subTitle='Latest attendance sessions across all courses'
            />
          </div>
        </DataTable>
      )}
    </>
  );
}

export default RecentSessions;
