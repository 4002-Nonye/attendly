export const formStepFields = {
  admin: [
    [{ name: 'fullName' }, { name: 'email' }], //step 1
    [{ name: 'school' }], // step 2
    [{ name: 'password' }, { name: 'confirmPassword' }], // step 3
  ],
  lecturer: [
    [{ name: 'fullName' }, { name: 'email' }], //step 1
    [
      {
        name: 'school',
        type: 'select',
      },
      {
        name: 'faculty',
        type: 'select',
      },
      {
        name: 'department',
        type: 'select',
      },
    ], // step 2
    [{ name: 'password' }, { name: 'confirmPassword' }], // step 3
  ],

  student: [
    [{ name: 'fullName' }, { name: 'email' }], //step 1
    [
      {
        name: 'school',
        type: 'select',
      },
      {
        name: 'faculty',
        type: 'select',
      },
      {
        name: 'department',
        type: 'select',
      },
      { name: 'level' },
      { name: 'matricNo' },
    ], // step 2
    [{ name: 'password' }, { name: 'confirmPassword' }], // step 3
  ],
};
