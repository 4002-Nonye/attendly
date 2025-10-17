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
  Legend,
} from 'recharts';

function Chart() {
const COLORS = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];


  // Attendance trend data
  const attendanceTrend = [
    { day: 'Mon', rate: 85 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 78 },
    { day: 'Thu', rate: 88 },
    { day: 'Fri', rate: 95 },
    { day: 'Sat', rate: 82 },
    { day: 'Sun', rate: 70 },
  ];

  // Student distribution data
  const studentDistribution = [
    { name: 'Engineering', value: 450 },
    { name: 'Sciences', value: 380 },
    { name: 'Arts', value: 355 },
    { name: 'Social Sciences', value: 340 },
    { name: 'Medicine', value: 280 },
  ];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      {/* Chart 1: Attendance Trend */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Attendance Trend
            </h3>
            <p className='text-sm text-gray-600'>This week's attendance rate</p>
          </div>
          <span className='text-2xl font-bold text-blue-600'>87%</span>
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
            Student Distribution
          </h3>
          <p className='text-sm text-gray-600'>Students across faculties</p>
        </div>

        <ResponsiveContainer width='100%' height={250}>
          <PieChart>
            <Pie
              data={studentDistribution}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey='value'
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
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
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
