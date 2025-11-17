import { ArrowLeft, Clock } from 'lucide-react';
import Button from '../../../components/Button';
import { useSessionStudentDetails } from './useSessionStudentDetails';
import { useNavigate, useParams } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import { formatTime } from '../../../utils/dateHelper';

function AttendanceSessionStudentsDetails() {
  const { courseId, sessionId } = useParams();

  const navigate = useNavigate();

  const { data, isPending } = useSessionStudentDetails({
    courseId,
    sessionId,
  });

  const students = data?.students || [];
  const session =data?.session||[]


  const columns = ['Matric Number', 'Full Name', 'Status', 'Time Marked'];

  const renderRow = (student) => (
    <tr key={student.studentId} className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4 text-sm font-medium text-gray-900 uppercase'>
        {student.matricNo}
      </td>
      <td className='px-6 py-4 text-sm text-gray-700 capitalize'>
        {student.fullName}
      </td>
      <td className='px-6 py-4'>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            student.status === 'Present'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {student.status === 'Present' ? '✓ Present' : '✗ Absent'}
        </span>
      </td>
      <td className='px-6 py-4 text-sm text-gray-700'>
        {student.timeMarked !== '-' && (
          <span className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />
            {formatTime(student.timeMarked)}
          </span>
        )}
        {student.timeMarked === '-' && <span className='text-gray-400'>-</span>}
      </td>
    </tr>
  );

  return (
    <>
      {/* Back Button */}
      <div className='mb-6'>
        <Button variant='outline' size='md' onClick={() => navigate(-1)}>
          <ArrowLeft className='w-4 h-4' />
          Back to Sessions
        </Button>
      </div>

      {/* Session Info Card */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {/* {selectedCourse.courseCode} - {selectedCourse.courseTitle} */}
        </h3>
        {/* <p className='text-sm text-gray-600 mt-1'>
          Session on{' '}
          {new Date(selectedSession.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}{' '}
          at {selectedSession.time}
        </p> */}
        <div className='grid grid-cols-4 gap-4 mt-4'>
          <div>
            <p className='text-sm text-gray-600'>Total Students</p>
            <p className='text-xl font-bold text-gray-900'>{students.length}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Present</p>
            <p className='text-xl font-bold text-green-600'>
              {
                students.filter((student) => student.status === 'Present')
                  .length
              }
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Absent</p>
            <p className='text-xl font-bold text-red-600'>
              {
                students.filter((student) => student.status !== 'Present')
                  .length
              }
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Session status</p>
            <p className='text-xl font-bold text-gray-900'>
              {session.status}
            </p>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <DataTable
        columns={columns}
        renderRow={renderRow}
        data={students}
        isPending={isPending}
        showSkeletonHead={false}
      />
    </>
  );
}

export default AttendanceSessionStudentsDetails;
