import { useUser } from '../../features/auth/hooks/useUser';
import ActiveSessionsLecturer from '../../features/session/lecturer/ActiveSessionsLecturer';
import ActiveSessionsStudent from '../../features/session/student/ActiveSessionsStudent';

function ActiveSessions() {
  const { data: user } = useUser();

  const role = user?.user?.role;
  return (
    <div className='flex'>
      {role === 'lecturer' && <ActiveSessionsLecturer />}
      {role === 'student' && <ActiveSessionsStudent />}
    </div>
  );
}

export default ActiveSessions;
