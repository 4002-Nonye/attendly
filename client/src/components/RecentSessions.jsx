import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useRecentSession } from '../features/dashboard/general/useRecentSession';
import TableSkeleton from './TableSkeleton';
import DataTable from './DataTable';
import SectionIntro from './SectionIntro';
import EmptyChart from './EmptyChart';
import EmptyCard from './EmptyCard';

function RecentSessions() {
  const { data, isPending } = useRecentSession();
  const recentSessions = data?.sessions || [];

  const columns = [
    'Course',
    'Started By',
    'Ended By',
    'Date & Time',
    'Attendance',
    'Status',
  ];

  const renderRow = (session) => (
    <tr key={session.id} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div>
          <div className='text-sm font-medium text-gray-900'>
            {session.course}
          </div>
          <div className='text-sm text-gray-500'>{session.courseCode}</div>
        </div>
      </td>

      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {session.startedBy}
      </td>

      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
        {session.status === 'active' ? 'In progress' : session.endedBy}
      </td>

      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center gap-2 text-sm text-gray-900'>
          <Calendar className='w-4 h-4 text-gray-400' />
          <span>
            {new Date(session.date).toLocaleDateString('en-GB', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className='flex items-center gap-2 text-sm text-gray-500 mt-1'>
          <Clock className='w-4 h-4 text-gray-400' />
          <span>{session.time}</span>
        </div>
      </td>

      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 font-medium'>
          {session.attended}/{session.enrolled}
        </div>
        <div className='text-xs text-gray-500'>
          {session.enrolled
            ? Math.round((session.attended / session.enrolled) * 100)
            : 0}
          % present
        </div>
      </td>

      <td className='px-6 py-4 whitespace-nowrap'>
        {session.status === 'active' ? (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
            <div className='w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse'></div>
            Active
          </span>
        ) : (
          <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
            <CheckCircle2 className='w-3 h-3' />
            Ended
          </span>
        )}
      </td>
    </tr>
  );

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
