export const extractFirstname = (data) => {
  const firstName = data?.user?.fullName?.split(' ')[0] || 'User';
  return firstName;
};

export const extractSemester = (data) => {
  const semester = data?.user?.schoolId?.currentSemester ?? null;
  return semester;
};

export const extractAcademicYear = (data) => {
  const academicYear = data?.user?.schoolId?.currentAcademicYear?.year ?? null;
  return academicYear;
};
