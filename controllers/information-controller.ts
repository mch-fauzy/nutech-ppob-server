import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import {INTERNAL_STATUS_CODE} from '../common/constants/internal-status-code-constant';
import {responseWithDetails} from '../common/utils/http/response';
import {InformationService} from '../services/information-service';
import {AuthMiddleware} from '../middlewares/auth-middleware';

// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class InformationController {
  static getBannerList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const response = await InformationService.getBannerList();

      responseWithDetails(
        res,
        StatusCodes.OK,
        INTERNAL_STATUS_CODE.SUCCESS,
        'Get banner list success',
        response,
      );
    } catch (error) {
      next(error);
    }
  };

  static getServiceList = [
    AuthMiddleware.authenticateToken,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await InformationService.getServiceList();

        responseWithDetails(
          res,
          StatusCodes.OK,
          INTERNAL_STATUS_CODE.SUCCESS,
          'Get service list success',
          response,
        );
      } catch (error) {
        next(error);
      }
    },
  ];
}

export {InformationController};
