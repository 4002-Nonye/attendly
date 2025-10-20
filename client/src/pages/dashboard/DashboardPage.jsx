import { useUser } from '../../features/auth/hooks/useUser';
import AdminDashboard from '../../features/dashboard/admin/AdminDashboard';
import LecturerDashboard from '../../features/dashboard/lecturer/LecturerDashboard';
import StudentDashboard from '../../features/dashboard/StudentDashboard';
function DashboardPage() {
  const { data: user } = useUser();

  const role = user?.user?.role;

  return (
    <div className='flex'>
      {role === 'admin' && <AdminDashboard />}
      {role === 'lecturer' && <LecturerDashboard />}
      {role === 'student' && <StudentDashboard />}
    </div>
  );
}

export default DashboardPage;
