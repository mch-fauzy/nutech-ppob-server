import { Prisma } from '@prisma/client';
declare const USER_DB_FIELD: {
    readonly id: "id";
    readonly email: "email";
    readonly password: "password";
    readonly firstName: "first_name";
    readonly lastName: "last_name";
    readonly profileImage: "profile_image";
    readonly balance: "balance";
    readonly createdAt: "created_at";
    readonly createdBy: "created_by";
    readonly updatedAt: "updated_at";
    readonly updatedBy: "updated_by";
    readonly deletedAt: "deleted_at";
    readonly deletedBy: "deleted_by";
};
interface UserDb {
    id: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    balance: number;
    created_at: Date;
    created_by: string | null;
    updated_at: Date;
    updated_by: string | null;
    deleted_at: Date | null;
    deleted_by: string | null;
}
interface User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
    balance: number;
    createdAt: Date;
    createdBy: string | null;
    updatedAt: Date;
    updatedBy: string | null;
    deletedAt: Date | null;
    deletedBy: string | null;
}
interface UserUpdate {
    id: string;
    data: UserUpdateProfile | UserUpdateProfileImage | UserUpdateBalance;
    tx?: Prisma.TransactionClient;
}
type UserPrimaryId = Pick<User, 'id'>;
type UserCreate = Pick<User, 'id' | 'email' | 'password' | 'firstName' | 'lastName' | 'createdBy' | 'updatedBy' | 'updatedAt'>;
type UserUpdateProfile = Pick<User, 'firstName' | 'lastName' | 'updatedBy' | 'updatedAt'>;
type UserUpdateProfileImage = Pick<User, 'profileImage' | 'updatedBy' | 'updatedAt'>;
type UserUpdateBalance = Pick<User, 'balance' | 'updatedBy' | 'updatedAt'>;
export { USER_DB_FIELD, UserDb, User, UserPrimaryId, UserCreate, UserUpdate };
