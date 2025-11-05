import { useSchoolInfo } from './useSchoolInfo';

// block features if the school has no active academic year
export const useButtonState = () => {
  const { semester, academicYear } = useSchoolInfo();
  const disableButton = !semester || !academicYear;
  return { disableButton };
};
