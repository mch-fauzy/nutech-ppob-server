"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipController = void 0;
const http_status_codes_1 = require("http-status-codes");
const membership_service_1 = require("../services/membership-service");
const membership_validator_1 = require("../models/dto/membership/membership-validator");
const internal_status_code_constant_1 = require("../common/constants/internal-status-code-constant");
const express_constant_1 = require("../common/constants/express-constant");
const response_1 = require("../common/utils/http/response");
const config_1 = require("../configs/config");
const failure_1 = require("../common/utils/errors/failure");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const multer_middleware_1 = require("../middlewares/multer-middleware");
// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class MembershipController {
    static register = async ({ body }, res, next) => {
        try {
            const request = {
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                password: body.password,
            };
            const validatedRequest = await membership_validator_1.MembershipValidator.validateRegisterRequest(request);
            const response = await membership_service_1.MembershipService.register({
                email: validatedRequest.email,
                firstName: validatedRequest.firstName,
                lastName: validatedRequest.lastName,
                password: validatedRequest.password,
            });
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Register success', response);
        }
        catch (error) {
            next(error);
        }
    };
    static login = async (req, res, next) => {
        try {
            const request = {
                email: req.body.email,
                password: req.body.password,
            };
            const validatedRequest = await membership_validator_1.MembershipValidator.validateLoginRequest(request);
            const response = await membership_service_1.MembershipService.login({
                email: validatedRequest.email,
                password: validatedRequest.password,
            });
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Login success', response);
        }
        catch (error) {
            next(error);
        }
    };
    static getProfileForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const request = {
                    email: req.res?.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                };
                const validatedRequest = await membership_validator_1.MembershipValidator.validateGetByEmailRequest(request);
                const response = await membership_service_1.MembershipService.getByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Get profile success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
    static updateProfileForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        async (req, res, next) => {
            try {
                const request = {
                    email: req.res?.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                };
                const validatedRequest = await membership_validator_1.MembershipValidator.validateUpdateProfileByEmailRequest(request);
                await membership_service_1.MembershipService.updateProfileByEmail({
                    email: validatedRequest.email,
                    firstName: validatedRequest.firstName,
                    lastName: validatedRequest.lastName,
                });
                const response = await membership_service_1.MembershipService.getByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Update profile success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
    static updateProfileImageForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        multer_middleware_1.MulterMiddleware.saveProfileImageToLocal,
        async (req, res, next) => {
            try {
                if (!req.file)
                    throw failure_1.Failure.badRequest('File is not found');
                const request = {
                    email: req.res?.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                    imageUrl: `${config_1.CONFIG.APP.IMAGE_STATIC_URL}/${req.file.filename}`,
                };
                const validatedRequest = await membership_validator_1.MembershipValidator.validateUpdateProfileImageByEmailRequest(request);
                // Update profile image
                await membership_service_1.MembershipService.updateProfileImageByEmail({
                    email: validatedRequest.email,
                    imageUrl: validatedRequest.imageUrl,
                });
                // Get profile
                const response = await membership_service_1.MembershipService.getByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Update profile image success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
    static updateProfileImageCloudinaryForCurrentUser = [
        auth_middleware_1.AuthMiddleware.authenticateToken,
        multer_middleware_1.MulterMiddleware.uploadProfileImageToCloud,
        async (req, res, next) => {
            try {
                if (!req.file)
                    throw failure_1.Failure.badRequest('File is not found');
                const request = {
                    email: req.res?.locals[express_constant_1.EXPRESS.LOCAL.EMAIL],
                    fileName: req.file.filename,
                    buffer: req.file.buffer,
                    mimeType: req.file.mimetype,
                };
                const validatedRequest = await membership_validator_1.MembershipValidator.validateUpdateProfileImageCloudinaryByEmailRequest(request);
                // Update profile image and upload the image to cloudinary
                await membership_service_1.MembershipService.updateProfileImageCloudinaryByEmail({
                    email: validatedRequest.email,
                    fileName: validatedRequest.fileName,
                    buffer: validatedRequest.buffer,
                    mimeType: validatedRequest.mimeType,
                });
                // Get profile
                const response = await membership_service_1.MembershipService.getByEmail({
                    email: validatedRequest.email,
                });
                (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, internal_status_code_constant_1.INTERNAL_STATUS_CODE.SUCCESS, 'Update profile image success', response);
            }
            catch (error) {
                next(error);
            }
        },
    ];
}
exports.MembershipController = MembershipController;
//# sourceMappingURL=membership-controller.js.map