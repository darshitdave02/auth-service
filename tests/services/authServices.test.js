// eslint-disable-next-line no-unused-vars
const { UniqueConstraintError } = require('sequelize');
const authServices = require('../../src/services/authServices');
const db = require('../../src/models/index.js').User;
const passwordUtil = require('../../src/utils/passwordUtil');
// eslint-disable-next-line no-unused-vars
const HTTPError = require('../../src/utils/HTTPError');
const tokenUtil = require('../../src/utils/tokenUtil');

describe('User Service', () => {
  describe('register', () => {
    it('should create a user when username and password is valid', async () => {
      const mockUser = {
        id: 1,
        username: 'test',
        password: 'encryptedpassword',
        createdAt: '2021-03-01T00:00:00.000Z',
        updatedAt: '2021-03-01T00:00:00.000Z',
      };
      jest
        .spyOn(passwordUtil, 'encryptPassword')
        .mockResolvedValue('encryptedpassword');
      jest.spyOn(db, 'create').mockResolvedValue({
        mockUser,
      });
      jest.spyOn(db, 'findOne').mockResolvedValue(null);
      const user = await authServices.register('test', 'password');
      console.log(user);
      expect(user).toEqual({
        mockUser: {
          id: 1,
          username: 'test',
          password: 'encryptedpassword',
          createdAt: '2021-03-01T00:00:00.000Z',
          updatedAt: '2021-03-01T00:00:00.000Z',
        },
      });
    });

    it('should throw an error if username is already taken', async () => {
      jest
        .spyOn(db, 'create')
        .mockRejectedValueOnce(new UniqueConstraintError());
      await expect(authServices.register('test', 'password')).rejects.toEqual(
        expect.objectContaining({ message: 'Username already exists' })
      );
    });

    // it('should throw an error if creating user in database fails', (async () => {
    //   jest.spyOn(db, 'create').mockRejectedValue(new Error());
    //   await expect(authServices.register('test', 'password')).rejects.toEqual(expect.objectContaining({ message: 'Internal server error' }));
    // }));
  });
  describe('login', () => {
    const mockUser = {
      id: 1,
      username: 'test',
      password: 'password',
      createdAt: '2021-03-01T00:00:00.000Z',
      updatedAt: '2021-03-01T00:00:00.000Z',
    };

    it('should return user if username and password is valid', async () => {
      jest.spyOn(db, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(passwordUtil, 'checkEncryptedPassword')
        .mockResolvedValue(true);
      jest.spyOn(tokenUtil, 'generateToken').mockResolvedValue('token');
      const decodedToken = await authServices.login('test', 'password');
      expect(decodedToken).toEqual({ token: 'token', user: mockUser });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(db, 'findOne').mockResolvedValue(null);
      await expect(authServices.login('test', 'password')).rejects.toEqual(
        expect.objectContaining({ message: 'User not found' })
      );
    });
  });
  describe('validateToken', () => {
    it('should return decoded token if token is valid', async () => {
      jest.spyOn(tokenUtil, 'verifyToken').mockResolvedValue({ id: 1 });
      const decodedToken = await authServices.validateToken('token');
      expect(decodedToken).toEqual({ id: 1 });
    });
    it('should throw an error if token is invalid', async () => {
      jest.spyOn(tokenUtil, 'verifyToken').mockResolvedValue(null);
      await expect(authServices.validateToken('token')).rejects.toEqual(
        expect.objectContaining({ message: 'Invalid token' })
      );
    });
  });
});
