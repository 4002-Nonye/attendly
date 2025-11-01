import { useSchoolInfo } from './useSchoolInfo';

export const useButtonState = () => {
  const { semester, academicYear } = useSchoolInfo();
  const disableButton = !semester || !academicYear;
  return { disableButton };
};
