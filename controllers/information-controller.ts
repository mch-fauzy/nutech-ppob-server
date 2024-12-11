import {
    Request,
    Response,
    NextFunction
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { CONSTANT } from '../utils/constant';
import {
    responseWithDetails
} from '../utils/response';
import { InformationService } from '../services/information-service';

class InformationController {
    static getBannerList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await InformationService.getBannerList();

            responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Get banner list success', response);
        } catch (error) {
            next(error);
        }
    };

    static getServiceList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await InformationService.getServiceList();

            responseWithDetails(res, StatusCodes.OK, CONSTANT.INTERNAL_STATUS_CODES.SUCCESS, 'Get service list success', response);
        } catch (error) {
            next(error);
        }
    };
}

export { InformationController };
