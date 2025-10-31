import { useUser } from '../features/auth/hooks/useUser';

export const useSchoolInfo = () => {
  const { data: user, isLoading, error, ...rest } = useUser();

  const userData = user?.user;
  const schoolData = userData?.schoolId;

  const firstName = userData?.fullName?.split(' ')[0] || 'User';
  const semester = schoolData?.currentSemester ?? null;
  const academicYear = schoolData?.currentAcademicYear?.year ?? null;
  const schoolId = schoolData?._id ?? null;

  return {
    firstName,
    semester,
    academicYear,
    schoolId,
    user: userData,
    isLoading,
    error,
    ...rest,
  };
};