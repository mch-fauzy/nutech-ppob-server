import {hash, compare, genSalt} from 'bcryptjs';

interface PasswordHash {
  password: string;
  saltRounds?: number;
}

interface PasswordCompare {
  password: string;
  hashedPassword: string;
}

const hashPassword = async ({password, saltRounds = 10}: PasswordHash) => {
  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
};

const comparePassword = async ({password, hashedPassword}: PasswordCompare) => {
  const isValidPassword = await compare(password, hashedPassword);
  return isValidPassword;
};

export {hashPassword, comparePassword};
