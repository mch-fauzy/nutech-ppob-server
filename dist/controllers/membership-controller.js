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
exports.MembershipController = void 0;
const http_status_codes_1 = require("http-status-codes");
const membership_service_1 = require("../services/membership-service");
const membership_dto_1 = require("../models/dto/membership-dto");
const constant_1 = require("../utils/constant");
const response_1 = require("../utils/response");
const config_1 = require("../configs/config");
const multer_middleware_1 = require("../middlewares/multer-middleware");
class MembershipController {
}
exports.MembershipController = MembershipController;
_a = MembershipController;
MembershipController.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
        };
        const validatedRequest = yield membership_dto_1.MembershipValidator.validateRegisterRequest(request);
        const response = yield membership_service_1.MembershipService.register({
            email: validatedRequest.email,
            firstName: validatedRequest.firstName,
            lastName: validatedRequest.lastName,
            password: validatedRequest.password
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Register success', response);
    }
    catch (error) {
        next(error);
    }
});
MembershipController.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: req.body.email,
            password: req.body.password,
        };
        const validatedRequest = yield membership_dto_1.MembershipValidator.validateLoginRequest(request);
        const response = yield membership_service_1.MembershipService.login({
            email: validatedRequest.email,
            password: validatedRequest.password
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Login success', response);
    }
    catch (error) {
        next(error);
    }
});
MembershipController.getProfileForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL])
        };
        const validatedRequest = yield membership_dto_1.MembershipValidator.validateGetByEmailRequest(request);
        const response = yield membership_service_1.MembershipService.getByEmail({
            email: validatedRequest.email
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Get profile success', response);
    }
    catch (error) {
        next(error);
    }
});
MembershipController.updateProfileForCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = {
            email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL]),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
        const validatedRequest = yield membership_dto_1.MembershipValidator.validateUpdateByEmailRequest(request);
        yield membership_service_1.MembershipService.updateByEmail({
            email: validatedRequest.email,
            firstName: validatedRequest.firstName,
            lastName: validatedRequest.lastName
        });
        const response = yield membership_service_1.MembershipService.getByEmail({
            email: validatedRequest.email
        });
        (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Update profile success', response);
    }
    catch (error) {
        next(error);
    }
});
// TODO: If either on fail, then both fail
MembershipController.updateProfileImageForCurrentUser = [
    multer_middleware_1.saveProfileImageToLocal,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = {
                email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL]),
                imageUrl: `${config_1.CONFIG.APP.IMAGE_STATIC_URL}/${req.file.filename}`
            };
            const validatedRequest = yield membership_dto_1.MembershipValidator.validateUpdateProfileImageByEmailRequest(request);
            // Update profile image
            yield membership_service_1.MembershipService.updateProfileImageByEmail({
                email: validatedRequest.email,
                imageUrl: validatedRequest.imageUrl
            });
            // Get profile
            const response = yield membership_service_1.MembershipService.getByEmail({
                email: validatedRequest.email
            });
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Update profile image success', response);
        }
        catch (error) {
            next(error);
        }
    })
];
MembershipController.updateProfileImageCloudinaryForCurrentUser = [
    multer_middleware_1.uploadProfileImageToCloud,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = {
                email: String(req.headers[constant_1.CONSTANT.HEADERS.EMAIL]),
                fileName: req.file.filename,
                buffer: req.file.buffer,
                mimeType: req.file.mimetype
            };
            const validatedRequest = yield membership_dto_1.MembershipValidator.validateUpdateProfileImageCloudinaryByEmailRequest(request);
            // Update profile image and upload the image to cloudinary
            yield membership_service_1.MembershipService.updateProfileImageCloudinaryByEmail({
                email: validatedRequest.email,
                fileName: validatedRequest.fileName,
                buffer: validatedRequest.buffer,
                mimeType: validatedRequest.mimeType
            });
            // Get profile
            const response = yield membership_service_1.MembershipService.getByEmail({
                email: validatedRequest.email
            });
            (0, response_1.responseWithDetails)(res, http_status_codes_1.StatusCodes.OK, constant_1.CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Update profile image success', response);
        }
        catch (error) {
            next(error);
        }
    })
];
