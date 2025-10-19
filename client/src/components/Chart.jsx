import { useWeeklySchoolTrend } from '../features/attendance/useWeeklySchoolTrend';
import ChartSkeleton from './ChartSkeleton';
import { useWeeklyFacultyTrend } from '../features/attendance/useWeeklyFacultyTrend';
import SchoolAttendanceChart from './SchoolAttendanceChart';
import FacultyAttendanceChart from './FacultyAttendanceChart';

function Chart() {
  const { data: schoolTrend, isPending: isWeeklySchoolPending } =
    useWeeklySchoolTrend();
  const { data: facultyTrend, isPending: isWeeklyFacultyPending } =
    useWeeklyFacultyTrend();

  const facultyAttendanceTrend = facultyTrend?.trend;
  const schoolAttendanceTrend = schoolTrend?.trend;

  // Calculate average attendance rate
  const averageRate =
    schoolAttendanceTrend?.length > 0
      ? Math.round(
          schoolAttendanceTrend.reduce((acc, curr) => acc + curr.rate, 0) /
            schoolAttendanceTrend?.length
        )
      : 0;

  // Empty state check (any item rate = 0)
  const hasFacultyTrendData = facultyAttendanceTrend?.some((f) => f.rate !== 0);
  const hasSchoolTrendData = schoolAttendanceTrend?.some((s) => s.rate !== 0);

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
        />
      )}
    </div>
  );
}

export default Chart;
