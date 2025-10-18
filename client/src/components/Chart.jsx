import { BarChart3 } from 'lucide-react';
import { useFacultyStats } from '../features/faculty/admin/useFacultyStats';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useWeeklySchoolTrend } from '../features/attendance/useWeeklySchoolTrend';
import ChartSkeleton from './ChartSkeleton';
import { useWeeklyFacultyTrend } from '../features/attendance/useWeeklyFacultyTrend';

function Chart() {

  const { data: schoolTrend, isPending: isWeeklySchoolPending } =
    useWeeklySchoolTrend();
  const { data: facultyTrend, isPending: isWeeklyFacultyPending } =
    useWeeklyFacultyTrend();


  const facultyAttendance = facultyTrend?.trend;
  const attendanceTrend = schoolTrend?.trend ;

  // Calculate average attendance rate
  const averageRate =
    attendanceTrend?.length > 0
      ? Math.round(
          attendanceTrend.reduce((acc, curr) => acc + curr.rate, 0) /
            attendanceTrend?.length
        )
      : 0;

  // Empty state check
const hasFacultyTrendData=facultyAttendance?.length > 0 
  const hasSchoolTrendData = attendanceTrend?.length > 0;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {/* Chart 1: Attendance Trend */}
      {isWeeklySchoolPending ? (
        <ChartSkeleton />
      ) : (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>
                Attendance Trend
              </h3>
              <p className='text-sm text-gray-600'>
                Weekly attendance rates across the school
              </p>
            </div>
            {hasSchoolTrendData && (
              <span className='text-2xl font-bold text-blue-600'>
                {averageRate}%
              </span>
            )}
          </div>

          {hasSchoolTrendData ? (
            <ResponsiveContainer width='100%' height={250}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
                <XAxis
                  dataKey='day'
                  stroke='#9ca3af'
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke='#9ca3af'
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`${value}%`, 'Attendance']}
                />
                <Line
                  type='monotone'
                  dataKey='rate'
                  stroke='#1e3a8a'
                  strokeWidth={3}
                  dot={{ fill: '#1e3a8a', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className='h-64 flex flex-col items-center justify-center text-gray-400'>
              <BarChart3 className='w-16 h-16 mb-4' />
              <p className='text-sm font-medium'>
                No attendance data available
              </p>
              <p className='text-xs mt-1'>
                Start tracking attendance to view trends
              </p>
            </div>
          )}
        </div>
      )}

      {/* Chart 2: Attendance by Faculty */}
      {isWeeklyFacultyPending ? (
        <ChartSkeleton />
      ) : (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Attendance by Faculty
            </h3>
            <p className='text-sm text-gray-600'>
              Average attendance rates across all faculties this week
            </p>
          </div>

          {hasFacultyTrendData? (
<div className='overflow-x-auto'>
  <div className='min-w-[700px] lg:min-w-[900px]'>
    <ResponsiveContainer width='100%' height={250}>
      <BarChart data={facultyAttendance}>
        <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
        <XAxis
          dataKey='faculty'
          stroke='#9ca3af'
          style={{ fontSize: '12px' }}
          interval={0}
          angle={-30}
          textAnchor='end'
          height={60}
        />
        <YAxis
          stroke='#9ca3af'
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value) => [`${value}%`, 'Attendance Rate']}
        />
        <Bar dataKey='rate' radius={[8, 8, 0, 0]}>
          {facultyAttendance.map((entry, index) => (
            <Cell key={`cell-${index}`} fill= '#1e3a8a' />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


          ) : (
            <div className='h-64 flex flex-col items-center justify-center text-gray-400'>
              <BarChart3 className='w-16 h-16 mb-4' />
              <p className='text-sm font-medium'>
                No attendance data available
              </p>
              <p className='text-xs mt-1'>
                Once students start attending classes, data will appear here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chart;
