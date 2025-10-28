import PropTypes from 'prop-types';
import { useSchoolInfo } from '../hooks/useSchoolInfo';
import AcademicYear from './AcademicYear';

function PageHeader({ title, subtitle, showGreeting = true }) {
  const { firstName } = useSchoolInfo();
  return (
    <div className='mb-6 lg:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
      <div>
        <h1 className='text-2xl lg:text-3xl font-bold text-gray-900'>
          {showGreeting ? `${title}, ${firstName}! 👋` : title}
        </h1>
        <p className='text-sm lg:text-base text-gray-600 mt-1'>{subtitle}</p>
      </div>

      {/* Academic Info */}
      <AcademicYear />
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  page: PropTypes.bool,
};

export default PageHeader;
