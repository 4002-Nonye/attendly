const { signup } = require('./signup');
const { login } = require('./login');
const { completeProfile } = require('./completeProfile');
const { logout } = require('./logout');
const { linkAccount } = require('./linkAccount');
const { forgotPassword } = require('./forgotPassword');
const { resetPassword } = require('./resetPassword');
const { getUser } = require('./user');
const { changePassword } = require('./changePassword');
const { setPassword } = require('./setPassword');

module.exports = {
  signup,
  login,
  completeProfile,
  logout,
  linkAccount,
  forgotPassword,
  resetPassword,
  getUser,
  changePassword,
  setPassword,
};
