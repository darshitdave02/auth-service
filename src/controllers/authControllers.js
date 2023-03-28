const authService = require('../services/authServices');
const HTTPError = require('../utils/HTTPError');

const register = async (request, response) => {
  try {
    console.log(request.body);
    const user = await authService.register(
      request.body.username,
      request.body.password
    );
    return response
      .status(201)
      .json({ status: 201, data: user, message: 'Succesfully Created User' });
  } catch (error) {
    if (error instanceof HTTPError)
      return response
        .status(error.code)
        .json({ status: error.code, message: error.message });
    return response.status(500).json({ status: 500, message: error.message });
  }
};
const login = async (request, response) => {
  try {
    const user = await authService.login(
      request.body.username,
      request.body.password
    );
    return response
      .status(200)
      .json({ status: 200, data: user, message: 'Succesfully Logged in' });
  } catch (error) {
    if (error instanceof HTTPError)
      return response
        .status(error.code)
        .json({ status: error.code, message: error.message });
    return response.status(500).json({ status: 500, message: error.message });
  }
};
const validateToken = async (request, response) => {
  try {
    const token = request.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = await authService.validateToken(token);
    return response
      .status(200)
      .json({ data: decodedToken, status: 200, message: 'Token Verified' });
  } catch (error) {
    if (error instanceof HTTPError)
      return response
        .status(error.code)
        .json({ status: error.code, message: error.message });
    return response.status(500).json({ status: 500, message: error.message });
  }
};
module.exports = { register, login, validateToken };
