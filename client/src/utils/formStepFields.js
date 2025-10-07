export const formStepFields = {
  admin: [
    [{ name: 'name' }, { name: 'email' }], //step 1
    [{ name: 'school' }, { name: 'session' }, { name: 'semester' }], // step 2
    [{ name: 'password' }, { name: 'confirmPassword' }], // step 3
  ],
  lecturer: [
   [ { name: 'name' },{ name: 'email' }], //step 1
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
       [{ name: 'name' }, { name: 'email' }, { name: 'matricNo' }], //step 1
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
    ], // step 2
    [{ name: 'password' }, { name: 'confirmPassword' }], // step 3
  ],
};
