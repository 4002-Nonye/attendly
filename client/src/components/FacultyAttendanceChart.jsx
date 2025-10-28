import EmptyChart from './EmptyChart';
import { BarChart3 } from 'lucide-react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import SectionIntro from './SectionIntro';

function FacultyAttendanceChart({ hasData, data, faculties }) {
  const colors = [
    '#1e3a8a',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ef4444',
    '#06b6d4',
  ];

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <SectionIntro
        title='Attendance by Faculty'
        subTitle='Daily attendance rates across all faculties this week'
        className='mb-4 lg:mb-5'
      />

      {hasData ? (
        <div className='overflow-x-auto'>
          <ResponsiveContainer width='100%' height={250}>
            <BarChart data={data}>
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => `${value}%`}
              />
              {faculties.map((faculty, index) => (
                <Bar
                  key={faculty}
                  dataKey={faculty}
                  fill={colors[index % colors.length]}
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyChart
          icon={BarChart3}
          message='No attendance data available'
          subMessage='Once students start attending classes for the week, data will appear here'
        />
      )}
    </div>
  );
}

FacultyAttendanceChart.propTypes = {
  hasData: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
    })
  ),
  faculties: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FacultyAttendanceChart;
