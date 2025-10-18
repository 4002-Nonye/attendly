import { BarChart3 } from 'lucide-react';
import { useFacultyStats } from '../features/faculty/admin/useFacultyStats';

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useWeeklyTrend } from '../features/attendance/useWeeklyTrend';

function Chart() {
  const COLORS = [
    '#1e3a8a',
    '#2563eb',
    '#3b82f6',
    '#60a5fa',
    '#93c5fd',
    '#dbeafe',
  ];

  const { data, isPending } = useFacultyStats();
  const { data: trend, isPending:isWeeklyPending } = useWeeklyTrend();
  

  // Transform data with fallback - Filter out faculties with 0 students
  const studentDistribution =
    data?.facultyStats
      ?.filter((f) => f.totalStudents > 0)
      ?.map((f) => ({
        name: f.name,
        value: f.totalStudents,
      })) || [];

  // Attendance trend data - Replace with API call later
  const attendanceTrend =trend?.trend
const averageRate = Number(
  (
    attendanceTrend?.reduce((acc, curr) => acc + curr.rate, 0) /
    attendanceTrend?.length
  ).toFixed(0)
);


  // Loading state
  if (isPending) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Skeleton for Chart 1 */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-40 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-48 mb-4'></div>
          <div className='h-64 bg-gray-100 rounded-lg'></div>
        </div>

        {/* Skeleton for Chart 2 */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse'>
          <div className='h-5 bg-gray-200 rounded w-40 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-48 mb-4'></div>
          <div className='h-64 bg-gray-100 rounded-lg'></div>
        </div>
      </div>
    );
  }

  // Empty state for pie chart
  const hasStudentData = studentDistribution.length > 0;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {/* Chart 1: Attendance Trend */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Attendance Trend
            </h3>
            <p className='text-sm text-gray-600'>
              Track weekly attendance fluctuations across the school
            </p>
          </div>
          <span className='text-2xl font-bold text-blue-600'>{averageRate}%</span>
        </div>

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
      </div>

      {/* Chart 2: Student Distribution */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Attendance Distribution
          </h3>
          <p className='text-sm text-gray-600'>
            Compare attendance performance across faculties
          </p>
        </div>

        {hasStudentData ? (
          <div className='flex flex-col md:flex-row items-center justify-center gap-6 h-64'>
            {/* Pie Chart */}
            <div className='w-full md:w-1/2 h-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={studentDistribution}
                    cx='50%'
                    cy='50%'
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={studentDistribution.length === 1 ? 0 : 2}
                    dataKey='value'
                    label={false}
                  >
                    {studentDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value, name) => [
                      `${value} ${value === 1 ? 'student' : 'students'}`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className='w-full md:w-1/2 space-y-2 max-h-64 overflow-y-auto pr-2'>
              {studentDistribution.map((entry, index) => {
                const total = studentDistribution.reduce(
                  (sum, item) => sum + item.value,
                  0
                );
                const percentage = ((entry.value / total) * 100).toFixed(1);

                return (
                  <div
                    key={`legend-${index}`}
                    className='flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-center gap-2.5 flex-1 min-w-0'>
                      <div
                        className='w-3.5 h-3.5 rounded flex-shrink-0'
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className='text-sm font-medium text-gray-700 truncate'>
                        {entry.name}
                      </span>
                    </div>
                    <div className='flex items-center gap-3 flex-shrink-0 ml-2'>
                      <span className='text-sm font-semibold text-gray-900'>
                        {entry.value}
                      </span>
                      <span className='text-xs font-medium text-gray-500 w-12 text-right'>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className='h-64 flex flex-col items-center justify-center text-gray-400'>
            <BarChart3 className='w-16 h-16 mb-4' />
            <p className='text-sm font-medium'>No data available</p>
            <p className='text-xs mt-1'>
              Add faculties and students to view attendance insights
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chart;
