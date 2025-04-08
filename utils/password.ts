import {hash, compare, genSalt} from 'bcryptjs';

import {CONFIG} from '../configs/config';

interface PasswordHash {
  password: string;
  saltRounds?: number;
}

interface PasswordCompare {
  password: string;
  hashedPassword: string;
}

const hashPassword = async ({
  password,
  saltRounds = Number(CONFIG.BCRYPT_SALT_ROUNDS),
}: PasswordHash) => {
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

const comparePassword = async ({password, hashedPassword}: PasswordCompare) => {
  const isValidPassword = await compare(password, hashedPassword);
  return isValidPassword;
};

export {hashPassword, comparePassword};
