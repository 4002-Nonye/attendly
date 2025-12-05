
import { BookOpen,Building2, GraduationCap } from 'lucide-react';
import PropTypes from 'prop-types';

function ProfileAcademicInfo({ studentData, isLecturer = false }) {
  const academicFields = isLecturer
    ? [
        {
          icon: Building2,
          label: 'Department',
          value: studentData.department,
        },
        {
          icon: BookOpen,
          label: 'Faculty',
          value: studentData.faculty,
        },
      ]
    : [
        {
          icon: Building2,
          label: 'Department',
          value: studentData.department,
        },
        {
          icon: BookOpen,
          label: 'Faculty',
          value: studentData.faculty,
        },
        {
          icon: GraduationCap,
          label: 'Level',
          value: `${studentData.level} Level`,
        },
      ];

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 capitalize'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
          <GraduationCap className='w-5 h-5 text-blue-600' />
        </div>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>
            Academic Information
          </h3>
          <p className='text-sm text-gray-500'>
            Your current academic details
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {academicFields.map((field, index) => (
          <div key={index} className='space-y-2'>
            <div className='flex items-center gap-2 text-gray-500 text-sm'>
              <field.icon className='w-4 h-4' />
              <span>{field.label}</span>
            </div>
            <p className='text-gray-900 font-semibold text-base pl-6'>
              {field.value}
            </p>
          </div>
        ))}
      </div>

      {/* Academic Year/Semester */}
      {  studentData.academicYear && studentData.currentSemester && (
        <div className='mt-6 pt-6 border-t border-gray-100 space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Academic Year</span>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
              {studentData.academicYear}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Current Semester</span>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize'>
              {studentData.currentSemester}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileAcademicInfo.propTypes = {
  studentData: PropTypes.object.isRequired,
  isLecturer: PropTypes.bool,
};

export default ProfileAcademicInfo;