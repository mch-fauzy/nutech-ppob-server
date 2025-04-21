/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
declare class MembershipController {
    static register: ({ body }: Request, res: Response, next: NextFunction) => Promise<void>;
    static login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    static getProfileForCurrentUser: ((req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void)[];
    static updateProfileForCurrentUser: ((req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void)[];
    static updateProfileImageForCurrentUser: ((req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void)[];
    static updateProfileImageCloudinaryForCurrentUser: ((req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => void)[];
}
export { MembershipController };
