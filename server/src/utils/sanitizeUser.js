const sanitizeUser = (doc) => {
  const { __v, password, resetPasswordToken, resetPasswordExpires, ...user } =
    doc;
  return user;
};

module.exports = sanitizeUser;
