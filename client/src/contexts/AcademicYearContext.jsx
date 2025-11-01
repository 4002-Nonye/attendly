
import { createContext, useContext } from 'react';

const AcademicYearContext = createContext();

export function AcademicYearProvider({ children, academicYear }) {
  return (
    <AcademicYearContext.Provider value={{ academicYear, isReady: !!academicYear }}>
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYear() {
  const context = useContext(AcademicYearContext);
  if (!context) throw new Error('useAcademicYear must be used within AcademicYearProvider');
  return context;
}

