import { Activity, Clock } from 'lucide-react';
import { useButtonState } from '../../../hooks/useButtonState';
import PageHeader from '../../../components/PageHeader';
import EmptyCard from '../../../components/EmptyCard';
import Button from '../../../components/Button';
import SearchBar from '../../../components/SearchBar';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import DataTable from '../../../components/DataTable';
import SessionsCard from '../../../components/SessionsCard';
import { useActiveSessionStudent } from './useActiveSessionStudent';
import { formatTime } from '../../../utils/dateHelper';
import { useFilteredSessions } from '../../../hooks/filters/useFilteredSessions';
import SessionsCardSkeleton from '../../../components/SessionCardSkeleton';
import { useMarkAttendance } from './useMarkAttendance';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

function ActiveSessionsStudent() {
  const { disableButton } = useButtonState();

  const [searchQuery, setSearchQuery] = useSearchQuery();
  const { data: sessions, isPending } = useActiveSessionStudent();

  const { markAttendance } = useMarkAttendance();
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Filter sessions
  const filteredSessions = useFilteredSessions(sessions?.session, searchQuery);

  const handleMarkAttendance = (sessionId) => {
    setActiveSessionId(sessionId);

    markAttendance({sessionId}, {
      onSettled: () => setActiveSessionId(null),
    });
  };

  const columns = ['Course', 'Status', 'Started By', 'Started At', 'Actions'];

  const renderRow = (session) => {
    const isMarkingSession = session._id === activeSessionId;
    const marked = session.attendanceMarked;

    return (
      <tr key={session._id} className='hover:bg-gray-50'>
        {/* Course */}
        <td className='px-6 py-4'>
          <div>
            <div className='text-sm font-semibold text-gray-900 uppercase'>
              {session.course.courseCode}
            </div>
            <div className='text-sm text-gray-600 capitalize'>
              {session.course.courseTitle}
            </div>
          </div>
        </td>

        {/* Status */}
        <td className='px-6 py-4'>
          <div className='flex items-center gap-2'>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
            </span>
            <span className='text-sm font-medium text-green-700 capitalize'>
              {session.status}
            </span>
          </div>
        </td>

        {/* Started By */}
        <td className='px-6 py-4'>
          <div className='text-sm font-medium text-gray-900 whitespace-nowrap'>
            {session.startedBy.fullName}
          </div>
        </td>

        {/* Started At */}
        <td className='px-6 py-4'>
          <div className='flex items-center gap-1.5 text-sm text-gray-700 whitespace-nowrap'>
            <Clock size={16} className='text-gray-400' />
            {formatTime(session.createdAt)}
          </div>
        </td>
        <td className='px-6 py-4'>
          <Button
            onClick={() => handleMarkAttendance(session._id)}
            variant={marked ? 'secondary' : 'primary'}
            disabled={isMarkingSession || marked}
            size='sm'
            className='capitalize whitespace-nowrap w-38'
          >
            {isMarkingSession ? (
              <ClipLoader size={22} color='#fff' />
            ) : marked ? (
              'Marked'
            ) : (
              'Mark attendance'
            )}
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Active Sessions'
        subtitle='Mark your attendance for ongoing sessions'
      />

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search...'
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={disableButton}
        />
      </div>

      {filteredSessions?.length === 0 && !isPending ? (
        <EmptyCard
          icon={Activity}
          title={searchQuery ? 'No sessions found' : 'No active sessions'}
          message={
            searchQuery
              ? 'Try adjusting your search query'
              : 'There are no ongoing attendance sessions at the moment'
          }
          iconBg='bg-gray-100'
          iconColor='text-gray-400'
        />
      ) : (
        <>
          {/* Desktop Table */}

          <div className='hidden xl:block'>
            <DataTable
              columns={columns}
              renderRow={renderRow}
              data={filteredSessions}
              isPending={isPending}
              showSkeletonHead={false}
            />
          </div>

          {/* Mobile Cards */}
          <div className='xl:hidden grid grid-cols-1 md:grid-cols-2  gap-4'>
            {isPending ? (
              <SessionsCardSkeleton />
            ) : (
              filteredSessions?.map((session) => {
                const isMarkingSession = session._id === activeSessionId;
                const marked = session.attendanceMarked;

                return (
                  <SessionsCard key={session._id} session={session}>
                    <div className='pt-6 border-t border-gray-100'>
                      <Button
                        onClick={() => handleMarkAttendance(session._id)}
                        variant={marked ? 'secondary' : 'primary'}
                        disabled={isMarkingSession || marked}
                        size='sm'
                        fullWidth
                        className='capitalize whitespace-nowrap'
                      >
                        {isMarkingSession ? (
                          <ClipLoader size={22} color='#fff' />
                        ) : marked ? (
                          'Marked'
                        ) : (
                          'Mark attendance'
                        )}
                      </Button>
                    </div>
                  </SessionsCard>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ActiveSessionsStudent;
