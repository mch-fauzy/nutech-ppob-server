import {
    Request,
    Response,
    NextFunction
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { MembershipService } from '../services/membership-service';
import {
    MembershipGetByEmailRequest,
    MembershipLoginRequest,
    MembershipRegisterRequest,
    MembershipUpdateByEmailRequest,
    MembershipUpdateProfileImageByEmailRequest,
    MembershipUpdateProfileImageCloudinaryByEmailRequest,
    MembershipValidator
} from '../models/dto/membership-dto';
import { CONSTANT } from '../utils/constant';
import {
    responseWithDetails
} from '../utils/response';
import { CONFIG } from '../configs/config';
import {
    uploadProfileImageToCloud,
    saveProfileImageToLocal
} from '../middlewares/multer-middleware';

class MembershipController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: MembershipRegisterRequest = {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
            };
            const validatedRequest = await MembershipValidator.validateRegisterRequest(request);

            const response = await MembershipService.register({
                email: validatedRequest.email,
                firstName: validatedRequest.firstName,
                lastName: validatedRequest.lastName,
                password: validatedRequest.password
            });

            responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Register success', response);
        } catch (error) {
            next(error);
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: MembershipLoginRequest = {
                email: req.body.email,
                password: req.body.password,
            };
            const validatedRequest = await MembershipValidator.validateLoginRequest(request);

            const response = await MembershipService.login({
                email: validatedRequest.email,
                password: validatedRequest.password
            });

            responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Login success', response);
        } catch (error) {
            next(error);
        }
    };

    static getProfileForCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: MembershipGetByEmailRequest = {
                email: String(req.headers[CONSTANT.HEADERS.EMAIL])
            };
            const validatedRequest = await MembershipValidator.validateGetByEmailRequest(request);

            const response = await MembershipService.getByEmail({
                email: validatedRequest.email
            });

            responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Get profile success', response);
        } catch (error) {
            next(error);
        }
    };

    static updateProfileForCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request: MembershipUpdateByEmailRequest = {
                email: String(req.headers[CONSTANT.HEADERS.EMAIL]),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            };
            const validatedRequest = await MembershipValidator.validateUpdateByEmailRequest(request);

            await MembershipService.updateByEmail({
                email: validatedRequest.email,
                firstName: validatedRequest.firstName,
                lastName: validatedRequest.lastName
            });

            const response = await MembershipService.getByEmail({
                email: validatedRequest.email
            });

            responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Update profile success', response);
        } catch (error) {
            next(error);
        }
    };

    // TODO: If either on fail, then both fail
    static updateProfileImageForCurrentUser = [
        saveProfileImageToLocal,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const request: MembershipUpdateProfileImageByEmailRequest = {
                    email: String(req.headers[CONSTANT.HEADERS.EMAIL]),
                    imageUrl: `${CONFIG.APP.IMAGE_STATIC_URL}/${req.file!.filename}`
                };
                const validatedRequest = await MembershipValidator.validateUpdateProfileImageByEmailRequest(request);

                // Update profile image
                await MembershipService.updateProfileImageByEmail({
                    email: validatedRequest.email,
                    imageUrl: validatedRequest.imageUrl
                });

                // Get profile
                const response = await MembershipService.getByEmail({
                    email: validatedRequest.email
                });

                responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Update profile image success', response);
            } catch (error) {
                next(error);
            }
        }
    ];

    static updateProfileImageCloudinaryForCurrentUser = [
        uploadProfileImageToCloud,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const request: MembershipUpdateProfileImageCloudinaryByEmailRequest = {
                    email: String(req.headers[CONSTANT.HEADERS.EMAIL]),
                    fileName: req.file!.filename,
                    buffer: req.file!.buffer,
                    mimeType: req.file!.mimetype
                };
                const validatedRequest = await MembershipValidator.validateUpdateProfileImageCloudinaryByEmailRequest(request);

                // Update profile image and upload the image to cloudinary
                await MembershipService.updateProfileImageCloudinaryByEmail({
                    email: validatedRequest.email,
                    fileName: validatedRequest.fileName,
                    buffer: validatedRequest.buffer,
                    mimeType: validatedRequest.mimeType
                });

                // Get profile
                const response = await MembershipService.getByEmail({
                    email: validatedRequest.email
                });

                responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Update profile image success', response);
            } catch (error) {
                next(error);
            }
        }
    ];
}

export { MembershipController };
