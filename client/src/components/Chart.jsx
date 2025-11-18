import { useWeeklySchoolTrend } from '../features/dashboard/admin/useWeeklySchoolTrend';
import ChartSkeleton from './ChartSkeleton';
import { useWeeklyFacultyTrend } from '../features/dashboard/admin/useWeeklyFacultyTrend';
import SchoolAttendanceChart from './SchoolAttendanceChart';
import FacultyAttendanceChart from './FacultyAttendanceChart';

function Chart() {
  const { data: schoolTrend, isPending: isWeeklySchoolPending } =
    useWeeklySchoolTrend();

  const { data: facultyTrend, isPending: isWeeklyFacultyPending } =
    useWeeklyFacultyTrend();

  const facultyAttendanceTrend = facultyTrend?.trend;
  const schoolAttendanceTrend = schoolTrend?.trend;

  // extract faculty names
  const faculties =
    facultyTrend?.trend?.length > 0
      ? Object.keys(facultyTrend.trend[0]).filter((key) => key !== 'day')
      : [];

  // calculate average attendance rate
  const averageRate =
    schoolAttendanceTrend?.length > 0
      ? Math.round(
          schoolAttendanceTrend.reduce((acc, curr) => acc + curr.rate, 0) /
            schoolAttendanceTrend.length
        )
      : 0;

  // empty state check
  const hasFacultyTrendData = facultyAttendanceTrend?.length > 0;
  const hasSchoolTrendData = schoolAttendanceTrend?.length > 0;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {/* Chart 1: Attendance Trend  across school*/}
      {isWeeklySchoolPending ? (
        <ChartSkeleton />
      ) : (
        <SchoolAttendanceChart
          hasData={hasSchoolTrendData}
          data={schoolAttendanceTrend}
          averageRate={averageRate}
        />
      )}

      {/* Chart 2: Attendance by Faculty */}
      {isWeeklyFacultyPending ? (
        <ChartSkeleton />
      ) : (
        <FacultyAttendanceChart
          hasData={hasFacultyTrendData}
          data={facultyAttendanceTrend}
          faculties={faculties}
        />
      )}
    </div>
  );
}

export default Chart;
