import { useState } from 'react';
import PropTypes from 'prop-types';
import { GraduationCap, UserStar, BookOpenText } from 'lucide-react';
import Button from './Button';

const roles = [
  {
    id: 'admin',
    icon: UserStar,
    title: 'Admin',
    description:'Create schools, faculties, departments, courses and view attendance reports.',
  },
  {
    id: 'lecturer',
    icon: BookOpenText,
    title: 'Lecturer',
    description: 'Start classes, take attendance and view attendance reports.',
  },
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    description:
      'Mark attendance for ongoing sessions and view personal attendance reports.',
  },
];

function SelectRole({ selectedRole, onSelect }) {
  // track the selected role within this component
  const [roleLocal, setRoleLocal] = useState(selectedRole || null);

  const handleContinue = () => {
    if (roleLocal) {
      onSelect(roleLocal); // update parent component
    }
  };

  return (
    <div className='my-6 flex flex-col items-center w-full mt-20'>
      {/* Heading */}
      <h1 className='text-2xl font-semibold mb-8 text-gray-800'>
        Select your role
      </h1>

      {/* Role selection cards */}
      <div className='flex flex-wrap justify-center gap-6'>
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = roleLocal === role.id;

          return (
            <div
              key={role.id}
              onClick={() => setRoleLocal(role.id)} // set selected role when clicked
              className={`
  shadow-lg h-72 md:w-56 w-[90%] justify-center cursor-pointer
  text-center items-center flex flex-col rounded-md p-3
  transition-all duration-300 hover:shadow-xl hover:scale-105
  text-blue-900 border-2
  ${isSelected ? 'border-blue-700' : 'border-transparent'}
`}

              role='button'
              tabIndex={0}
            >
              {/* Role icon */}
              <Icon size={50} />

              {/* Role title */}
              <p className='font-medium text-lg mt-5 mb-2'>{role.title}</p>

              {/* Role description */}
              <p className='text-[15px]'>{role.description}</p>
            </div>
          );
        })}
      </div>

      {/* Continue button  */}
      <Button
        size='lg'
        className='mt-16'
        disabled={!roleLocal}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
}

SelectRole.propTypes = {
  selectedRole: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default SelectRole;
