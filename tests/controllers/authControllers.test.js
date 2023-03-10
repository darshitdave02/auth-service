const authControllers = require('../../src/controllers/authControllers');
const authServices = require('../../src/services/authServices');
const HTTPError = require('../../src/utils/HTTPError');

describe('User Controller', () => {
  describe('register', () => {
    it('should return 201 status code when user is successfully created', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'test',
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
      };
      authServices.register = jest.fn().mockReturnValue(mockUser);
      await authControllers.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: mockUser,
        message: 'Succesfully Created User',
        status: 201,
      });
    });

    it('should return 400 status code if user with same username already exists', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      const mockError = new HTTPError(
        'User with this username already exists',
        400
      );
      authServices.register = jest.fn().mockRejectedValue(mockError);
      await authControllers.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User with this username already exists',
        status: 400,
      });
    });

    it('should return 500 status code if creating user in database fails', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      const mockError = new Error('Error creating user');
      authServices.register = jest.fn().mockRejectedValue(mockError);
      await authControllers.register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating user',
        status: 500,
      });
    });
  });
  describe('login', () => {
    it('should return 200 status code when user is successfully logged in', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'test',
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
      };
      authServices.login = jest.fn().mockReturnValue(mockUser);
      await authControllers.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockUser,
        message: 'Succesfully Logged in',
        status: 200,
      });
    });
    it('should return 400 status code if user with given username does not exist', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      const mockError = new HTTPError(
        'User with this username does not exist',
        400
      );
      authServices.login = jest.fn().mockRejectedValue(mockError);
      await authControllers.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User with this username does not exist',
        status: 400,
      });
    });
    it('should return 400 status code if password is incorrect', async () => {
      const mockReq = {
        body: {
          username: 'test',
          password: 'test',
        },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const mockError = new HTTPError('Password is incorrect', 400);
      authServices.login = jest.fn().mockRejectedValue(mockError);
      await authControllers.login(mockReq, mockRes, next);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password is incorrect',
        status: 400,
      });
    });
    it('should return 500 status code if logging in user in database fails', async () => {
      const req = {
        body: {
          username: 'test',
          password: 'test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      const mockError = new Error('Error logging in user');
      authServices.login = jest.fn().mockRejectedValue(mockError);
      await authControllers.login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error logging in user',
        status: 500,
      });
    });
  });

  describe('validateToken', () => {
    it('should return 200 status code when token is valid', async () => {
      const req = {
        headers: {
          authorization: 'Bearer test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      authServices.validateToken = jest.fn().mockReturnValue('token');
      await authControllers.validateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: 'token',
        message: 'Token Verified',
        status: 200,
      });
    });

    it('should return 401 status code if token is invalid', async () => {
      const req = {
        headers: {
          authorization: 'Bearer test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();
      const mockError = new HTTPError('Token is invalid', 401);
      authServices.validateToken = jest.fn().mockRejectedValue(mockError);
      await authControllers.validateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token is invalid',
        status: 401,
      });
    });

    it('should return 500 status code if checking validity of token fails', async () => {
      const req = {
        headers: {
          authorization: 'Bearer test',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      const mockError = new Error('Error checking validity of token');
      authServices.validateToken = jest.fn().mockRejectedValue(mockError);
      await authControllers.validateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error checking validity of token',
        status: 500,
      });
    });
  });
});
