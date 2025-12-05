import { useUser } from '../../features/auth/hooks/useUser';
import LecturerProfile from '../../features/profile/lecturer/LecturerProfile';
import StudentProfile from '../../features/profile/student/StudentProfile';

function ProfilePage() {
  const { data: user } = useUser();

  const role = user?.user?.role;
  return (
    <div className='flex'>
      {role === 'lecturer' && <LecturerProfile />}
      {role === 'student' && <StudentProfile />}
      {/* {role === 'admin' && <AttendanceDetailsAdmin />} */}
    </div>
  );
}

export default ProfilePage;
