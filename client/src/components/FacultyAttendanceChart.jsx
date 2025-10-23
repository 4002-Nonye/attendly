import EmptyChart from './EmptyChart';
import { BarChart3 } from 'lucide-react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import SectionIntro from './SectionIntro';

function FacultyAttendanceChart({ hasData, data }) {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
      <SectionIntro
        title='Attendance by Faculty'
        subTitle='Average attendance rates across all faculties this week'
        className='mb-4 lg:mb-5'
      />

      {hasData ? (
        <div className='overflow-x-auto '>
          <ResponsiveContainer width='100%' height={250}>
            <BarChart data={data}>
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
              <Bar dataKey='rate' radius={[8, 8, 0, 0]} maxBarSize={60}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill='#1e3a8a' />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
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

FacultyAttendanceChart.propTypes = {
  hasData: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      faculty: PropTypes.string.isRequired,
      rate: PropTypes.number.isRequired,
    })
  ),
};

export default FacultyAttendanceChart;
