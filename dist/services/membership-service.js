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
        if (!(0, uuid_1.validate)(id))
            throw failure_1.Failure.badRequest('Invalid UUID format');
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
        winston_1.logger.error(`[MembershipService.register] Error registering user: ${error}`);
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
        const isValidPassword = yield (0, password_1.comparePassword)(req.password, users[0].password);
        if (!isValidPassword)
            throw failure_1.Failure.invalidCredentials('Invalid email or password');
        const response = (0, jwt_1.generateToken)({
            email: users[0].email
        });
        return response;
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.login] Error login user: ${error}`);
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
        return users[0];
    }
    catch (error) {
        if (error instanceof failure_1.Failure)
            throw error;
        winston_1.logger.error(`[MembershipService.getById] Error retrieving user by email: ${error}`);
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
        const userPrimaryId = { id: users[0].id };
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
        winston_1.logger.error(`[MembershipService.updateByEmail] Error updating user by email: ${error}`);
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
        winston_1.logger.error(`[MembershipService.updateProfileImageByEmail] Error updating user profile image by email: ${error}`);
        throw failure_1.Failure.internalServer('Failed to update user profile image by email');
    }
});
