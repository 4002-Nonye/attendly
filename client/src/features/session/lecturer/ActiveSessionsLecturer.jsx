import { useNavigate, Link } from 'react-router-dom';
import { Activity, Clock, Eye, XCircle } from 'lucide-react';

import { useButtonState } from '../../../hooks/useButtonState';
import PageHeader from '../../../components/PageHeader';
import EmptyCard from '../../../components/EmptyCard';
import Button from '../../../components/Button';
import SearchBar from '../../../components/SearchBar';
import { useSearchQuery } from '../../../hooks/useSearchQuery';
import DataTable from '../../../components/DataTable';
import SessionsCard from '../../../components/SessionsCard';
import { useActiveSessionLecturer } from './useActiveSessionLecturer';
import { formatTime } from '../../../utils/dateHelper';
import { useFilteredSessions } from '../../../hooks/useFilteredSessions';
import SessionsCardSkeleton from '../../../components/SessionCardSkeleton';
import { useEndSession } from './useEndSession';
import { useState } from 'react';
import { ClipLoader } from 'react-spinners';

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

  const renderRow = (session) => {
    const isSessionEnding = session._id === activeSessionId;

    return (
      <tr key={session._id} className='hover:bg-gray-50'>
        {/* ID */}
        <td className='px-6 py-4'>
          <Link
            to={`/sessions/${session._id}`}
            className='underline text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors'
            title='View session details & QR code'
          >
            #{session._id.slice(-6).toUpperCase()}
          </Link>
        </td>

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
          <div className='text-sm font-medium text-gray-900'>
            {session.startedBy.fullName}
          </div>
        </td>

        {/* Started At */}
        <td className='px-6 py-4'>
          <div className='flex items-center gap-1.5 text-sm text-gray-700'>
            <Clock size={16} className='text-gray-400' />
            {formatTime(session.createdAt)}
          </div>
        </td>

        {/* Actions */}
        <td className='px-6 py-4'>
          <Button
            variant='danger'
            size='sm'
            disabled={isSessionEnding}
            className='capitalize whitespace-nowrap w-30'
            onClick={() => handleEndSession(session._id)}
          >
            {isSessionEnding ? (
              <ClipLoader size={22} color='#fff' />
            ) : (
              'End session'
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
