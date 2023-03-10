const { generateToken, verifyToken } = require('../../src/utils/tokenUtil');
const jwt = require('jsonwebtoken');

describe('Token Util', () => {
  describe('generateToken', () => {
    it('should generate a token', async () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('token');
      const token = await generateToken('test');
      expect(token).toBe(token);
    });
  });
  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const token = await generateToken('test');
      const decoded = await verifyToken(token);
      expect(decoded).not.toBe(null);
    });
    it('should throw if token is null', async () => {
      jest.spyOn(jwt, 'verify').mockRejectedValue(new Error('error'));
      const isVerified = await verifyToken(null);
      expect(isVerified).toBe(false);
    });
  });
});
