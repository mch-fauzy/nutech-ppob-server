import { v4 as uuidv4 } from 'uuid';

import { logger } from '../configs/winston';
import { UserRepository } from '../repositories/user-repository';
import {
    MembershipRegisterRequest,
    MembershipLoginRequest,
    MembershipGetByEmailRequest,
    MembershipUpdateByEmailRequest,
    MembershipUpdateProfileImageByEmailRequest,
    MembershipUpdateProfileImageCloudinaryByEmailRequest
} from '../models/dto/membership-dto';
import { userDbField, UserPrimaryId } from '../models/user-model';
import {
    comparePassword,
    hashPassword
} from '../utils/password';
import { generateToken } from '../utils/jwt';
import { Failure } from '../utils/failure';
import { CloudinaryService } from './externals/cloudinary-service';

class MembershipService {
    static register = async (req: MembershipRegisterRequest) => {
        try {
            const totalUsers = await UserRepository.countByFilter({
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers !== BigInt(0)) throw Failure.conflict('User with this email already exists');

            const id = uuidv4();
            const hashedPassword = await hashPassword(req.password);
            await UserRepository.create({
                id,
                email: req.email,
                firstName: req.firstName,
                lastName: req.lastName,
                password: hashedPassword,
                createdBy: req.email,
                updatedBy: req.email,
                updatedAt: new Date()
            });

            return null;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[MembershipService.register] Error registering user: ${JSON.stringify(error)}`);
            throw Failure.internalServer('Failed to register user');
        }
    };

    static login = async (req: MembershipLoginRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.email,
                    userDbField.password,
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.invalidCredentials('Invalid email or password');
            const user = users[0];

            const isValidPassword = await comparePassword(req.password, user.password);
            if (!isValidPassword) throw Failure.invalidCredentials('Invalid email or password');

            const response = generateToken({
                email: user.email
            });

            return response;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[MembershipService.login] Error login user: ${JSON.stringify(error)}`);
            throw Failure.internalServer('Failed to login user');
        }
    };

    static getByEmail = async (req: MembershipGetByEmailRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.email,
                    userDbField.firstName,
                    userDbField.lastName,
                    userDbField.profileImage
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');
            const user = users[0];

            return user
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[MembershipService.getById] Error retrieving user by email: ${JSON.stringify(error)}`);
            throw Failure.internalServer('Failed to retrieve user by email');
        }
    };

    static updateByEmail = async (req: MembershipUpdateByEmailRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.id,
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');
            const user = users[0];

            const userPrimaryId: UserPrimaryId = { id: user.id };
            await UserRepository.updateById(userPrimaryId, {
                firstName: req.firstName,
                lastName: req.lastName,
                updatedBy: req.email,
                updatedAt: new Date()
            });

            return null;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[MembershipService.updateByEmail] Error updating user by email: ${JSON.stringify(error)}`);
            throw Failure.internalServer('Failed to update user by email');
        }
    };

    static updateProfileImageByEmail = async (req: MembershipUpdateProfileImageByEmailRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.id,
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');

            const userPrimaryId: UserPrimaryId = { id: users[0].id };
            await UserRepository.updateById(userPrimaryId, {
                profileImage: req.imageUrl,
                updatedBy: req.email,
                updatedAt: new Date()
            });

            return null;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[MembershipService.updateProfileImageByEmail] Error updating user profile image by email: ${JSON.stringify(error)}`);
            throw Failure.internalServer('Failed to update user profile image by email');
        }
    };

    static updateProfileImageCloudinaryByEmail = async (req: MembershipUpdateProfileImageCloudinaryByEmailRequest) => {
        try {
            const [users, totalUsers] = await UserRepository.findManyAndCountByFilter({
                selectFields: [
                    userDbField.id,
                ],
                filterFields: [{
                    field: userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
            });
            if (totalUsers === BigInt(0)) throw Failure.notFound('User with this email not found');

            // Upload image to cloudinary
            const response = await CloudinaryService.uploadImage({
                fileName: req.fileName,
                buffer: req.buffer,
                mimeType: req.mimeType
            });

            const userPrimaryId: UserPrimaryId = { id: users[0].id };
            await UserRepository.updateById(userPrimaryId, {
                profileImage: response.secure_url,
                updatedBy: req.email,
                updatedAt: new Date()
            });

            return null;
        } catch (error) {
            if (error instanceof Failure) throw error;

            logger.error(`[MembershipService.updateProfileImageCloudinaryByEmail] Error updating user profile image by email: ${JSON.stringify(error)}`);
            throw Failure.internalServer('Failed to update user profile image by email');
        }
    };
}

export { MembershipService };
