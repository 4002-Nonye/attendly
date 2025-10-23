import { useUser } from '../features/auth/hooks/useUser';

export const useSchoolInfo = () => {
  const { data: user, ...rest } = useUser();

  const firstName = user?.user?.fullName?.split(' ')[0] || 'User';
  const semester = user?.user?.schoolId?.currentSemester ?? null;
  const academicYear = user?.user?.schoolId?.currentAcademicYear?.year ?? null;

  return {
    firstName,
    semester,
    academicYear,
    user: user.user,
    ...rest,
  };
};
