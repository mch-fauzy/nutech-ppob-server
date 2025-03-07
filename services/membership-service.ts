import {v4 as uuidv4, v5 as uuidv5} from 'uuid';

import {UserRepository} from '../repositories/user-repository';
import type {
  MembershipRegisterRequest,
  MembershipLoginRequest,
  MembershipGetByEmailRequest,
  MembershipUpdateProfileByEmailRequest,
  MembershipUpdateProfileImageByEmailRequest,
  MembershipUpdateProfileImageCloudinaryByEmailRequest,
} from '../models/dto/membership-dto';
import {USER_DB_FIELD} from '../models/user-model';
import {comparePassword, hashPassword} from '../utils/password';
import {generateToken} from '../utils/jwt';
import {Failure} from '../utils/failure';
import {CloudinaryService} from './externals/cloudinary-service';
import {handleError} from '../utils/error-handler';

class MembershipService {
  static register = async (req: MembershipRegisterRequest) => {
    try {
      const totalUsers = await UserRepository.countByFilter({
        filterFields: [
          {
            field: USER_DB_FIELD.email,
            operator: 'equals',
            value: req.email,
          },
        ],
      });
      if (totalUsers !== BigInt(0))
        throw Failure.conflict('User with this email is already exists');

      const hashedPassword = await hashPassword({password: req.password});
      await UserRepository.create({
        id: uuidv5(req.email, uuidv4()),
        email: req.email,
        password: hashedPassword,
        firstName: req.firstName,
        lastName: req.lastName,
        createdBy: req.email,
        updatedBy: req.email,
        updatedAt: new Date(),
      });

      return null;
    } catch (error) {
      throw handleError({operationName: 'MembershipService.register', error});
    }
  };

  static login = async (req: MembershipLoginRequest) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [USER_DB_FIELD.email, USER_DB_FIELD.password],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.invalidCredentials('Email or Password is not valid');

      const user = users[0];

      const isValidPassword = await comparePassword({
        password: req.password,
        hashedPassword: user.password,
      });
      if (!isValidPassword)
        throw Failure.invalidCredentials('Email or Password is not valid');

      const response = generateToken({
        email: user.email,
      });

      return response;
    } catch (error) {
      throw handleError({operationName: 'MembershipService.login', error});
    }
  };

  static getByEmail = async (req: MembershipGetByEmailRequest) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [
            USER_DB_FIELD.email,
            USER_DB_FIELD.firstName,
            USER_DB_FIELD.lastName,
            USER_DB_FIELD.profileImage,
          ],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email is not found');
      const user = users[0];

      return user;
    } catch (error) {
      throw handleError({operationName: 'MembershipService.getByEmail', error});
    }
  };

  static updateProfileByEmail = async (
    req: MembershipUpdateProfileByEmailRequest,
  ) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [USER_DB_FIELD.id],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email is not found');

      const user = users[0];
      await UserRepository.updateById({
        id: user.id,
        data: {
          firstName: req.firstName,
          lastName: req.lastName,
          updatedBy: req.email,
          updatedAt: new Date(),
        },
      });

      return null;
    } catch (error) {
      throw handleError({
        operationName: 'MembershipService.updateProfileByEmail',
        error,
      });
    }
  };

  static updateProfileImageByEmail = async (
    req: MembershipUpdateProfileImageByEmailRequest,
  ) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [USER_DB_FIELD.id],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email is not found');

      const user = users[0];
      await UserRepository.updateById({
        id: user.id,
        data: {
          profileImage: req.imageUrl,
          updatedBy: req.email,
          updatedAt: new Date(),
        },
      });

      return null;
    } catch (error) {
      throw handleError({
        operationName: 'MembershipService.updateProfileImageByEmail',
        error,
      });
    }
  };

  static updateProfileImageCloudinaryByEmail = async (
    req: MembershipUpdateProfileImageCloudinaryByEmailRequest,
  ) => {
    try {
      const [users, totalUsers] = await UserRepository.findManyAndCountByFilter(
        {
          selectFields: [USER_DB_FIELD.id],
          filterFields: [
            {
              field: USER_DB_FIELD.email,
              operator: 'equals',
              value: req.email,
            },
          ],
        },
      );
      if (totalUsers === BigInt(0))
        throw Failure.notFound('User with this email is not found');

      // Upload image to Cloudinary
      const response = await CloudinaryService.uploadImage({
        fileName: req.fileName,
        buffer: req.buffer,
        mimeType: req.mimeType,
      });

      const user = users[0];
      await UserRepository.updateById({
        id: user.id,
        data: {
          profileImage: response.secure_url,
          updatedBy: req.email,
          updatedAt: new Date(),
        },
      });

      return null;
    } catch (error) {
      throw handleError({
        operationName: 'MembershipService.updateProfileImageCloudinaryByEmail',
        error,
      });
    }
  };
}

export {MembershipService};
