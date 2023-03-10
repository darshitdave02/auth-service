const { encryptPassword, checkEncryptedPassword } = require('../../src/utils/passwordUtil');

describe('Password Util', () => {
  describe('encryptPassword', () => {
    it('should encrypt a password', async () => {
      const password = 'password';
      const hashedPassword = await encryptPassword(password);
      expect(hashedPassword).not.toBe(null);
    });
    it('should throw if password is null', async () => {
      const password = null;
      await expect(encryptPassword(password)).rejects.toThrow();
    });
  }
  );
  describe('checkEncryptedPassword', () => {
    it('should check a password', async () => {
      const password = 'password';
      const hashedPassword = await encryptPassword(password);
      const isSame = await checkEncryptedPassword(hashedPassword, password,);
      expect(isSame).toBeTruthy();
    });
    it('should throw an error if password is null', async () => {
      const password = 'test';
      const hashedPassword = await encryptPassword(password);
      await expect(checkEncryptedPassword(null, hashedPassword)).rejects.toThrow();
    });
  }
  );
}
);