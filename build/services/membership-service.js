"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipService = void 0;
const uuid_1 = require("uuid");
const user_repository_1 = require("../repositories/user-repository");
const db_field_constant_1 = require("../common/constants/db-field-constant");
const password_1 = require("../common/utils/auth/password");
const jwt_1 = require("../common/utils/auth/jwt");
const failure_1 = require("../common/utils/errors/failure");
const cloudinary_service_1 = require("./externals/cloudinary-service");
const error_handler_1 = require("../common/utils/errors/error-handler");
// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class MembershipService {
    static register = async (req) => {
        try {
            const totalUsers = await user_repository_1.UserRepository.countByFilter({
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers !== BigInt(0))
                throw failure_1.Failure.conflict('User with this email is already exists');
            const hashedPassword = await (0, password_1.hashPassword)({ password: req.password });
            await user_repository_1.UserRepository.create({
                id: (0, uuid_1.v5)(req.email, (0, uuid_1.v4)()),
                email: req.email,
                password: hashedPassword,
                firstName: req.firstName,
                lastName: req.lastName,
                createdBy: req.email,
                updatedBy: req.email,
                updatedAt: new Date(),
            });
            return null;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({ operationName: 'MembershipService.register', error });
        }
    };
    static login = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.EMAIL, db_field_constant_1.DB_FIELD.PASSWORD],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.invalidCredentials('Email or Password is not valid');
            const user = users[0];
            const isValidPassword = await (0, password_1.comparePassword)({
                password: req.password,
                hashedPassword: user.password,
            });
            if (!isValidPassword)
                throw failure_1.Failure.invalidCredentials('Email or Password is not valid');
            const response = (0, jwt_1.generateToken)({
                email: user.email,
            });
            return response;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({ operationName: 'MembershipService.login', error });
        }
    };
    static getByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [
                    db_field_constant_1.DB_FIELD.EMAIL,
                    db_field_constant_1.DB_FIELD.FIRST_NAME,
                    db_field_constant_1.DB_FIELD.LAST_NAME,
                    db_field_constant_1.DB_FIELD.PROFILE_IMAGE,
                ],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email is not found');
            const user = users[0];
            return user;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({ operationName: 'MembershipService.getByEmail', error });
        }
    };
    static updateProfileByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.ID],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email is not found');
            const user = users[0];
            await user_repository_1.UserRepository.updateById({
                id: user.id,
                data: {
                    firstName: req.firstName,
                    lastName: req.lastName,
                    updatedBy: req.email,
                    updatedAt: new Date(),
                },
            });
            return null;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'MembershipService.updateProfileByEmail',
                error,
            });
        }
    };
    static updateProfileImageByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.ID],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email is not found');
            const user = users[0];
            await user_repository_1.UserRepository.updateById({
                id: user.id,
                data: {
                    profileImage: req.imageUrl,
                    updatedBy: req.email,
                    updatedAt: new Date(),
                },
            });
            return null;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'MembershipService.updateProfileImageByEmail',
                error,
            });
        }
    };
    static updateProfileImageCloudinaryByEmail = async (req) => {
        try {
            const [users, totalUsers] = await user_repository_1.UserRepository.findManyAndCountByFilter({
                selectFields: [db_field_constant_1.DB_FIELD.ID],
                filterFields: [
                    {
                        field: db_field_constant_1.DB_FIELD.EMAIL,
                        operator: 'equals',
                        value: req.email,
                    },
                ],
            });
            if (totalUsers === BigInt(0))
                throw failure_1.Failure.notFound('User with this email is not found');
            // Upload image to Cloudinary
            const response = await cloudinary_service_1.CloudinaryService.uploadImage({
                fileName: req.fileName,
                buffer: req.buffer,
                mimeType: req.mimeType,
            });
            const user = users[0];
            await user_repository_1.UserRepository.updateById({
                id: user.id,
                data: {
                    profileImage: response.secure_url,
                    updatedBy: req.email,
                    updatedAt: new Date(),
                },
            });
            return null;
        }
        catch (error) {
            throw (0, error_handler_1.handleError)({
                operationName: 'MembershipService.updateProfileImageCloudinaryByEmail',
                error,
            });
        }
    };
}
exports.MembershipService = MembershipService;
//# sourceMappingURL=membership-service.js.map