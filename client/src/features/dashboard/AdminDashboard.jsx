import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  Layers,
  Plus,
} from 'lucide-react';

import Button from '../../components/Button';
import { useUser } from '../../features/auth/hooks/useUser';
import { useDepartmentTotal } from '../department/admin/useDepartmentTotal';
import { useFacultyTotal } from '../faculty/admin/useFacultyTotal';
import { useCourseTotal } from '../course/admin/useCourseTotal';
import { useLecturerTotal } from '../user/useLecturerTotal';
import { useStudentTotal } from '../user/useStudentTotal';
import Card from '../../components/Card';
import Chart from '../../components/Chart';
import EmptyAcademicYear from '../../components/EmptyAcademicYear';
import RecentSessionsTable from '../../components/RecentSessionsTable';
import AcademicYear from '../../components/AcademicYear';
import {
  extractAcademicYear,
  extractFirstname,
  extractSemester,
} from '../../utils/helpers';
import SkeletonDashboard from '../../components/SkeletonDashboard';

function AdminDashboard() {
  const { data } = useUser();
  const { data: totalFaculties, isPending: isFacultyPending } =
    useFacultyTotal();
  const { data: totalDepartment, isPending: isDepartmentPending } =
    useDepartmentTotal();
  const { data: totalCourses, isPending: isCoursePending } = useCourseTotal();
  const { data: totalLecturers, isPending: isLecturerPending } =
    useLecturerTotal();
  const { data: totalStudents, isPending: isStudentPending } =
    useStudentTotal();

  const firstName = extractFirstname(data);
  const semester = extractSemester(data);
  const academicYear = extractAcademicYear(data);

  const stats = [
    {
      label: 'Total Faculties',
      value: totalFaculties?.total || 0,
      icon: Building2,
      color: 'bg-blue-100 text-blue-600',
      link: '/faculties',
    },
    {
      label: 'Total Departments',
      value: totalDepartment?.total || 0,
      icon: Layers,
      color: 'bg-purple-100 text-purple-600',
      link: '/departments',
    },
    {
      label: 'Total Courses',
      value: totalCourses?.total || 0,
      icon: BookOpen,
      color: 'bg-green-100 text-green-600',
      link: '/courses',
    },
    {
      label: 'Total Lecturers',
      value: totalLecturers?.total || 0,
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      link: '/lecturers',
    },
    {
      label: 'Total Students',
      value: totalStudents?.total || 0,
      icon: GraduationCap,
      color: 'bg-pink-100 text-pink-600',
      link: '/students',
    },
  ];
  if (
    isFacultyPending ||
    isDepartmentPending ||
    isCoursePending ||
    isLecturerPending ||
    isStudentPending
  )
    return <SkeletonDashboard/>;

  return (
    <div className='w-full'>
      {/* Welcome Header */}
      <div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back, {firstName}! 👋
          </h1>
          <p className='text-gray-600 mt-1'>
            Here's an overview of your school
          </p>
        </div>

        {/* Academic Info */}
        <AcademicYear semester={semester} academicYear={academicYear} />
      </div>

      {!academicYear || !semester ? (
        <EmptyAcademicYear />
      ) : (
        <>
          {/* Stats Card */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <Card key={index} {...stat} />
            ))}
          </div>

          {/* Charts Section */}
          <Chart />

          {/* Recent Sessions Table */}
          <RecentSessionsTable />

          {/* Quick Actions */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Quick Actions
            </h3>
            <div className='flex flex-wrap gap-3'>
              <Button variant='primary' icon={Plus}>
                Add Faculty
              </Button>
              <Button variant='primary' icon={Plus}>
                Add Department
              </Button>
              <Button variant='primary' icon={Plus}>
                Add Course
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
