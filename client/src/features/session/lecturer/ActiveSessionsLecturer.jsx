import { useState } from 'react';
import { Activity, Eye, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import Button from '../../../components/Button';
import DataTable from '../../../components/DataTable';
import EmptyCard from '../../../components/EmptyCard';
import PageHeader from '../../../components/PageHeader';
import SearchBar from '../../../components/SearchBar';
import SessionsCard from '../../../components/SessionsCard';
import SessionsCardSkeleton from '../../../components/skeletons/SessionCardSkeleton';
import LecturerActiveSessionRow from '../../../components/tableRows/LecturerActiveSessionRow';
import { useFilteredSessions } from '../../../hooks/filters/useFilteredSessions';
import { useButtonState } from '../../../hooks/useButtonState';
import { useSearchQuery } from '../../../hooks/useSearchQuery';

import { useActiveSessionLecturer } from './useActiveSessionLecturer';
import { useEndSession } from './useEndSession';

function ActiveSessionsLecturer() {
  const { disableButton } = useButtonState();

  const { data: sessions, isPending } = useActiveSessionLecturer();
  const { endSession } = useEndSession();
  const [activeSessionId, setActiveSessionId] = useState(null);

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useSearchQuery();

  // Filter sessions
  const filteredSessions = useFilteredSessions(sessions?.session, searchQuery);

  const handleViewDetails = (id) => navigate(`/sessions/${id}`);

  const handleEndSession = (sessionId) => {
    setActiveSessionId(sessionId);

    endSession(sessionId, {
      onSettled: () => setActiveSessionId(null),
    });
  };

  const columns = [
    'Session ID',
    'Course',
    'Status',
    'Started By',
    'Started At',
    'Actions',
  ];


const renderRow = (session) => (
  <LecturerActiveSessionRow
    key={session._id}
    session={session}
    onEndSession={handleEndSession}
    isEnding={session._id === activeSessionId}
  />
);


  return (
    <div className='w-full'>
      <PageHeader
        showGreeting={false}
        title='Active Sessions'
        subtitle='Manage ongoing attendance sessions'
      />

      {/* Search */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6'>
        <SearchBar
          placeholder='Search...'
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={disableButton}
        />
      </div>

      {/* Empty state or table/cards */}
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
          <div className='xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4'>
            {isPending ? (
              <SessionsCardSkeleton />
            ) : (
              filteredSessions?.map((session) => {
                const isSessionEnding = session._id === activeSessionId;

                return (
                  <SessionsCard key={session._id} session={session}>
                    {/* Action Buttons */}
                    <div className='pt-6 border-t border-gray-100'>
                      <div className='flex items-center gap-2'>
                        <Button
                          onClick={() => handleViewDetails(session._id)}
                          variant='secondary'
                          size='sm'
                          className='flex-1 justify-center'
                        >
                          <Eye size={18} className='mr-1.5' />
                          <span className='font-medium'>View Details</span>
                        </Button>

                        <Button
                          onClick={() => handleEndSession(session._id)}
                          variant='danger'
                          size='sm'
                          className='flex-1 justify-center'
                        >
                          {isSessionEnding ? (
                            <ClipLoader size={22} color='#fff' />
                          ) : (
                            <>
                              <XCircle size={18} className='mr-1.5' />
                              <span className='font-medium'>End Session</span>
                            </>
                          )}
                        </Button>
                      </div>
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

export default ActiveSessionsLecturer;
