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
    MembershipValidator
} from '../models/dto/membership-dto';
import { CONSTANT } from '../utils/constant';
import {
    responseWithDetails
} from '../utils/response';
import { CONFIG } from '../configs/config';
import { uploadImageToLocal } from '../middlewares/multer-img-middleware';
import { Failure } from '../utils/failure';

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

            responseWithDetails(res, StatusCodes.OK, CONSTANT.STATUS.SUCCESS, 'Register Success', response);
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

            responseWithDetails(res, StatusCodes.OK, CONSTANT.STATUS.SUCCESS, 'Login Success', response);
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

            responseWithDetails(res, StatusCodes.OK, CONSTANT.STATUS.SUCCESS, 'Get Profile For Current User Success', response);
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

            responseWithDetails(res, StatusCodes.OK, CONSTANT.STATUS.SUCCESS, 'Update Profile For Current User Success', response);
        } catch (error) {
            next(error);
        }
    };

    // TODO: If either on fail, then both fail
    static updateProfileImageForCurrentUser = [
        uploadImageToLocal,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.file) throw Failure.badRequest('No file uploaded');

                const request: MembershipUpdateProfileImageByEmailRequest = {
                    email: String(req.headers[CONSTANT.HEADERS.EMAIL]),
                    imageUrl: `${CONFIG.APP.IMAGE_STATIC_URL}/${req.file.filename}`
                };
                const validatedRequest = await MembershipValidator.validateUpdateProfileImageByEmailRequest(request);

                await MembershipService.updateProfileImageByEmail({
                    email: validatedRequest.email,
                    imageUrl: validatedRequest.imageUrl
                });

                const response = await MembershipService.getByEmail({
                    email: validatedRequest.email
                });

                responseWithDetails(res, StatusCodes.OK, CONSTANT.STATUS.SUCCESS, 'Update Profile Image For Current User Success', response);
            } catch (error) {
                next(error);
            }
        }]

}

export { MembershipController };
