import { Prisma } from '@prisma/client';
import { Filter } from './filter';
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
interface UserFind {
    id: string;
    filter: Pick<Filter, 'selectFields'>;
    tx?: Prisma.TransactionClient;
}
type UserPrimaryId = Pick<User, 'id'>;
type UserCreate = Pick<User, 'id' | 'email' | 'password' | 'firstName' | 'lastName' | 'createdBy' | 'updatedBy' | 'updatedAt'>;
type UserUpdateProfile = Pick<User, 'firstName' | 'lastName' | 'updatedBy' | 'updatedAt'>;
type UserUpdateProfileImage = Pick<User, 'profileImage' | 'updatedBy' | 'updatedAt'>;
type UserUpdateBalance = Pick<User, 'balance' | 'updatedBy' | 'updatedAt'>;
export { UserDb, User, UserPrimaryId, UserCreate, UserUpdate, UserFind };
