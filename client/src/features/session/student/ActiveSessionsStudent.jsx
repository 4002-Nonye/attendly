import { useState } from 'react';
import { Activity, Clock } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import SearchBar from '../../../components/SearchBar';
import SessionsCard from '../../../components/SessionsCard';
import SessionsCardSkeleton from '../../../components/skeletons/SessionCardSkeleton';
import StudentActiveSessionRow from '../../../components/tableRows/StudentActiveSessionRow';
import { useFilteredSessions } from '../../../hooks/filters/useFilteredSessions';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

import { useActiveSessionStudent } from './useActiveSessionStudent';
import { useMarkAttendance } from './useMarkAttendance';

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

    markAttendance(
      { sessionId },
      {
        onSettled: () => setActiveSessionId(null),
      }
    );
  };

  const columns = ['Course', 'Status', 'Started By', 'Started At', 'Actions'];

  const renderRow = (session) => (
    <StudentActiveSessionRow
      key={session._id}
      session={session}
      onMarkAttendance={handleMarkAttendance}
      isMarking={session._id === activeSessionId}
    />
  );

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
