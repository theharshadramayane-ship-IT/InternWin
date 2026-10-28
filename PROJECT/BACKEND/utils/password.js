import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword) => {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password is required.');
  }
  return bcrypt.hash(plainPassword.trim(), SALT_ROUNDS);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  return bcrypt.compare(plainPassword.trim(), hashedPassword);
};
