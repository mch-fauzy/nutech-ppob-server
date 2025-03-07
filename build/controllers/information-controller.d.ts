/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
declare class InformationController {
    static getBannerList: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static getServiceList: ((req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void)[];
}
export { InformationController };
