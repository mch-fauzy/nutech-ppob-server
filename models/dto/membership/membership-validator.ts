import Joi from 'joi';
import {
  MembershipRegisterRequest,
  MembershipLoginRequest,
  MembershipGetByEmailRequest,
  MembershipUpdateProfileByEmailRequest,
  MembershipUpdateProfileImageByEmailRequest,
  MembershipUpdateProfileImageCloudinaryByEmailRequest,
} from './membership-request-dto';

/**
 * Validator for membership-related requests
 */
class MembershipValidator {
  /**
   * Validator schema for registration requests
   */
  private static registerRequestValidator = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });

  /**
   * Validates a membership registration request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateRegisterRequest = async (
    req: MembershipRegisterRequest,
  ): Promise<MembershipRegisterRequest> => {
    return await this.registerRequestValidator.validateAsync(req);
  };

  /**
   * Validator schema for login requests
   */
  private static loginRequestValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  /**
   * Validates a membership login request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateLoginRequest = async (
    req: MembershipLoginRequest,
  ): Promise<MembershipLoginRequest> => {
    return await this.loginRequestValidator.validateAsync(req);
  };

  /**
   * Validator schema for get-by-email requests
   */
  private static getByEmailRequestValidator = Joi.object({
    email: Joi.string().email().required(),
  });

  /**
   * Validates a get-by-email request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateGetByEmailRequest = async (
    req: MembershipGetByEmailRequest,
  ): Promise<MembershipGetByEmailRequest> => {
    return await this.getByEmailRequestValidator.validateAsync(req);
  };

  /**
   * Validator schema for profile update requests
   */
  private static updateProfileByEmailRequestValidator = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  });

  /**
   * Validates a profile update request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateUpdateProfileByEmailRequest = async (
    req: MembershipUpdateProfileByEmailRequest,
  ): Promise<MembershipUpdateProfileByEmailRequest> => {
    return await this.updateProfileByEmailRequestValidator.validateAsync(req);
  };

  /**
   * Validator schema for profile image update requests
   */
  private static updateProfileImageByEmailRequestValidator = Joi.object({
    email: Joi.string().email().required(),
    imageUrl: Joi.string().uri().required(),
  });

  /**
   * Validates a profile image update request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateUpdateProfileImageByEmailRequest = async (
    req: MembershipUpdateProfileImageByEmailRequest,
  ): Promise<MembershipUpdateProfileImageByEmailRequest> => {
    return await this.updateProfileImageByEmailRequestValidator.validateAsync(
      req,
    );
  };

  /**
   * Validator schema for profile image update via Cloudinary requests
   */
  private static updateProfileImageByEmailCloudinaryRequestValidator =
    Joi.object({
      email: Joi.string().email().required(),
      fileName: Joi.string().required(),
      buffer: Joi.any()
        .custom((value, helpers) => {
          if (!(value instanceof Buffer)) return helpers.error('any.invalid');
          return value;
        })
        .required(),
      mimeType: Joi.string().required(),
    });

  /**
   * Validates a profile image update via Cloudinary request
   * @param req The request to validate
   * @returns The validated request
   */
  static validateUpdateProfileImageCloudinaryByEmailRequest = async (
    req: MembershipUpdateProfileImageCloudinaryByEmailRequest,
  ): Promise<MembershipUpdateProfileImageCloudinaryByEmailRequest> => {
    return await this.updateProfileImageByEmailCloudinaryRequestValidator.validateAsync(
      req,
    );
  };
}

export {MembershipValidator};
