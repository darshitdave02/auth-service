const User = require('../models/index').User;
const HTTPError = require('../utils/HTTPError');
const passwordUtil = require('../utils/passwordUtil');
const tokenUtil = require('../utils/tokenUtil');
const { UniqueConstraintError } = require('sequelize');

const register = async (userName, password) => {
  try {
    const encryptedPassword = await passwordUtil.encryptPassword(password);
    const user = await User.create({
      username: userName,
      password: encryptedPassword,
    });
    return user;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      console.log('Error');
      console.log('Username already exists', 400);
    }
    console.log(500, 'Internal server error', 500);
  }
};

const login = async (userName, password) => {
  const user = await User.findOne({ where: { username: userName } });
  if (!user) console.log('User not found', 400);

  const checkIfPasswordIsValid = await passwordUtil.checkEncryptedPassword(
    user.password,
    password
  );
  if (!checkIfPasswordIsValid) console.log('Invalid password', 401);
  const newToken = await tokenUtil.generateToken(user.id);
  return { user, token: newToken };
};

const validateToken = async (token) => {
  const decoded = await tokenUtil.verifyToken(token);
  if (!decoded) console.log('Invalid token', 401);
  return decoded;
};

module.exports = { register, login, validateToken };
