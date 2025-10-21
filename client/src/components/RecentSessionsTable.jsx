import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

import { useRecentSession } from '../features/dashboard/general/useRecentSession';

function RecentSessionsTable() {
  const { data, isPending } = useRecentSession();

  const recentSessions = data?.sessions || [];

  if (isPending) {
    return (
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 mb-8'>
        <div className='p-6 border-b border-gray-100'>
          <div className='h-6 w-48 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-4 w-64 bg-gray-200 rounded animate-pulse mt-2'></div>
        </div>
        <div className='p-6'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='h-16 bg-gray-100 rounded mb-2 animate-pulse'
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 mb-8'>
      <div className='p-6 border-b border-gray-100'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Recent Class Sessions
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              Latest attendance sessions across all courses
            </p>
          </div>
        </div>
      </div>

      {!recentSessions.length ? (
        <div className='h-72 flex flex-col justify-center items-center p-6 text-center text-gray-500'>
          <Calendar className='w-12 h-12 text-gray-300 mb-3' />
          <p className='font-medium text-gray-700'>No recent sessions found</p>
          <p className='text-sm text-gray-500 mt-1'>
            Sessions will appear here once created
          </p>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Course
                </th>

                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Started By
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Ended By
                </th>

                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date & Time
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Attendance
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {recentSessions.map((session) => (
                <tr
                  key={session.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {session.course}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {session.courseCode}
                      </div>
                    </div>
                  </td>

                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {session.startedBy}
                    </div>
                  
                  </td>
                   <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {session.endedBy || '-'}
                    </div>
                  
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
                      <span>{session.time}</span> {/* ✅ Remove hardcoded PM */}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900 font-medium'>
                      {session.attended}/{session.enrolled}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {session.enrolled
                        ? Math.round(
                            (session.attended / session.enrolled) * 100
                          )
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentSessionsTable;
