const jwt = require('jsonwebtoken');
require('dotenv').config();

const redisClient = require('../utils/redisUtil');

const generateToken = async (id) => {
  let token = await jwt.sign(
    { id: id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  await redisClient.set(token, '');
  return token;
};
const verifyToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const tokenInRedis = await redisClient.get(token);
    if (decodedToken && tokenInRedis != undefined)
      return decodedToken;
  } catch (error) {
    return false;
  }

};
module.exports = { generateToken, verifyToken };