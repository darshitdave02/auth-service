const express = require('express');
const authRouter = express.Router();
const { validateBody, userSchema } = require('../middlewares/validator');
const authController = require('../controllers/authControllers');

authRouter.post('/register', validateBody(userSchema) ,authController.register);
authRouter.post('/login', validateBody(userSchema) ,authController.login);
authRouter.get('/validate/token', authController.validateToken);

module.exports = authRouter;
