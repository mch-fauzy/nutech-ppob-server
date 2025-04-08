interface PasswordHash {
    password: string;
    saltRounds?: number;
}
interface PasswordCompare {
    password: string;
    hashedPassword: string;
}
declare const hashPassword: ({ password, saltRounds, }: PasswordHash) => Promise<string>;
declare const comparePassword: ({ password, hashedPassword }: PasswordCompare) => Promise<boolean>;
export { hashPassword, comparePassword };
