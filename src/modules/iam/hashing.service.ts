import bcrypt from 'bcrypt';

const compare = (data: string | Buffer, encrypted: string) => {
  return bcrypt.compare(data, encrypted);
};

const hash = async (data: string | Buffer) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(data, salt);
};

export default {
  compare,
  hash,
};
