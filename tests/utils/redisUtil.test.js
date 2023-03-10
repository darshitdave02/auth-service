const { get, set, client } = require('../../src/utils/redisUtil');

describe('Redis Util', () => {
  describe('get', () => {
    it('should get a value', async () => {
      jest.spyOn(client, 'get').mockReturnValue('test');
      const value = await get('test');
      expect(value).not.toBe(null);
    });
    it('should throw if key is null', async () => {
      try {
        await expect(get(null)).rejects.toThrow();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });


  describe('set', () => {
    it('should set a value', async () => {
      jest.spyOn(client, 'set').mockReturnValue('');
      const value = await set('test', '');
      expect(value).not.toBe(null);
    });
    it('should throw if key is null', async () => {
      try {
        await expect(set(null)).rejects.toThrow();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});