// Read-only property
const userDbField = {
    id: 'id',
    email: 'email',
    password: 'password',
    firstName: 'first_name',
    lastName: 'last_name',
    profileImage: 'profile_image',
    balance: 'balance',
    createdAt: 'created_at',
    createdBy: 'created_by',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by',
    deletedAt: 'deleted_at',
    deletedBy: 'deleted_by'
} as const;

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

type UserPrimaryId = Pick<User, 'id'>;

// Other fields either auto generated using default (like balance, createdAt) or nullable
type UserCreate = Pick<User, 'id' | 'email' | 'password' | 'firstName' | 'lastName' | 'createdBy' | 'updatedBy' | 'updatedAt'>;

type UserUpdate = Pick<User, 'firstName' | 'lastName' | 'updatedBy' | 'updatedAt'>;

type UserProfileImageUpdate = Pick<User, 'profileImage' | 'updatedBy' | 'updatedAt'>;

type UserBalanceUpdate = Pick<User, 'balance' | 'updatedBy' | 'updatedAt'>;

export {
    userDbField,
    User,
    UserPrimaryId,
    UserCreate,
    UserUpdate,
    UserProfileImageUpdate,
    UserBalanceUpdate
};
