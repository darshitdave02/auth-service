require('dotenv').config();
const { createClient } = require('redis');

let client = createClient();

client.on('error', err => console.log('Redis Client Error', err));
const get = async (key) => {
  try {
    await client.connect();
    const value = await client.get(key);

    await client.disconnect();
    return value;
  } catch (error) {
    console.log('error in get catch');
  }
};
const set = async (key, value) => {
  try {
    await client.connect();
    await client.set(key, value);

    await client.disconnect();
  } catch (error) {
    console.log('error in set catch');
  }
};
module.exports = { get, set, client };
