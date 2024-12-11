"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipService = void 0;
const uuid_1 = require("uuid");
const winston_1 = require("../configs/winston");
const user_repository_1 = require("../repositories/user-repository");
const user_model_1 = require("../models/user-model");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const failure_1 = require("../utils/failure");
const cloudinary_service_1 = require("./externals/cloudinary-service");
class MembershipService {
}
exports.MembershipService = MembershipService;
_a = MembershipService;
MembershipService.register = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield user_repository_1.UserRepository.countByFilter({
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers !== BigInt(0))
            throw failure_1.Failure.conflict('User with this email already exists');
        const id = (0, uuid_1.v4)();
        const hashedPassword = yield (0, password_1.hashPassword)(req.password);
        yield user_repository_1.UserRepository.create({
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
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.register] Error registering user: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to register user');
    }
});
MembershipService.login = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.email,
                user_model_1.userDbField.password,
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.invalidCredentials('Invalid email or password');
        const user = users[0];
        const isValidPassword = yield (0, password_1.comparePassword)(req.password, user.password);
        if (!isValidPassword)
            throw failure_1.Failure.invalidCredentials('Invalid email or password');
        const response = (0, jwt_1.generateToken)({
            email: user.email
        });
        return response;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.login] Error login user: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to login user');
    }
});
MembershipService.getByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.email,
                user_model_1.userDbField.firstName,
                user_model_1.userDbField.lastName,
                user_model_1.userDbField.profileImage
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        const user = users[0];
        return user;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.getById] Error retrieving user by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to retrieve user by email');
    }
});
MembershipService.updateByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.id,
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        const user = users[0];
        const userPrimaryId = { id: user.id };
        yield user_repository_1.UserRepository.updateById(userPrimaryId, {
            firstName: req.firstName,
            lastName: req.lastName,
            updatedBy: req.email,
            updatedAt: new Date()
        });
        return null;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.updateByEmail] Error updating user by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to update user by email');
    }
});
MembershipService.updateProfileImageByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.id,
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        const userPrimaryId = { id: users[0].id };
        yield user_repository_1.UserRepository.updateById(userPrimaryId, {
            profileImage: req.imageUrl,
            updatedBy: req.email,
            updatedAt: new Date()
        });
        return null;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.updateProfileImageByEmail] Error updating user profile image by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to update user profile image by email');
    }
});
MembershipService.updateProfileImageCloudinaryByEmail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, totalUsers] = yield user_repository_1.UserRepository.findManyAndCountByFilter({
            selectFields: [
                user_model_1.userDbField.id,
            ],
            filterFields: [{
                    field: user_model_1.userDbField.email,
                    operator: 'equals',
                    value: req.email
                }]
        });
        if (totalUsers === BigInt(0))
            throw failure_1.Failure.notFound('User with this email not found');
        // Upload image to cloudinary
        const response = yield cloudinary_service_1.CloudinaryService.uploadImage({
            fileName: req.fileName,
            buffer: req.buffer,
            mimeType: req.mimeType
        });
        const userPrimaryId = { id: users[0].id };
        yield user_repository_1.UserRepository.updateById(userPrimaryId, {
            profileImage: response.secure_url,
            updatedBy: req.email,
            updatedAt: new Date()
        });
        return null;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.updateProfileImageCloudinaryByEmail] Error updating user profile image by email: ${JSON.stringify(error)}`);
        throw failure_1.Failure.internalServer('Failed to update user profile image by email');
    }
});
