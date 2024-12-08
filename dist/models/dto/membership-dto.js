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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class MembershipValidator {
}
exports.MembershipValidator = MembershipValidator;
_a = MembershipValidator;
MembershipValidator.registerRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    password: joi_1.default.string().min(8).required(),
});
MembershipValidator.validateRegisterRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.registerRequestValidator.validateAsync(req);
});
MembershipValidator.loginRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required()
});
MembershipValidator.validateLoginRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.loginRequestValidator.validateAsync(req);
});
MembershipValidator.getByEmailRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
MembershipValidator.validateGetByEmailRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.getByEmailRequestValidator.validateAsync(req);
});
MembershipValidator.updateByEmailRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required()
});
MembershipValidator.validateUpdateByEmailRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.updateByEmailRequestValidator.validateAsync(req);
});
MembershipValidator.updateProfileImageByEmailRequestValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    imageUrl: joi_1.default.string().uri().required()
});
MembershipValidator.validateUpdateProfileImageByEmailRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _a.updateProfileImageByEmailRequestValidator.validateAsync(req);
});
