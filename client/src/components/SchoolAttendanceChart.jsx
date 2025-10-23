import { BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import EmptyChart from './EmptyChart';
import PropTypes from 'prop-types';
import SectionIntro from './SectionIntro';

function SchoolAttendanceChart({ hasData, data, averageRate }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <div className='flex items-start justify-between'>
        <SectionIntro
          title='Attendance Trend'
          subTitle='Weekly attendance rates across the school'
          className='mb-4 lg:mb-5'
        />
        {hasData && (
          <span className='text-2xl font-bold text-blue-600'>
            {averageRate}%
          </span>
        )}
      </div>

      {hasData ? (
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={data}>
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
        <EmptyChart
          icon={BarChart3}
          message='No attendance data available'
          subMessage='Once students start attending classes, data will appear here'
        />
      )}
    </div>
  );
}

SchoolAttendanceChart.propTypes = {
  hasData: PropTypes.bool.isRequired,
  averageRate: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SchoolAttendanceChart;
