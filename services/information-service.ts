import {Banner} from '../models/banner-model';
import {Service} from '../models/service-model';
import {BannerRepository} from '../repositories/banner-repository';
import {ServiceRepository} from '../repositories/service-repository';
import {DB_FIELD} from '../common/constants/db-field-constant';
import {handleError} from '../common/utils/errors/error-handler';

// TODO: ADD RETURN TYPE (IF NOT NATIVE TYPE) IN CONTROLLER, SERVICE, REPO AND ADD MIDDLEWARE OR UTILS TO response with data (message, data) or response with error (message, errors)
class InformationService {
  static getBannerList = async (): Promise<Banner[]> => {
    try {
      const [banners] = await BannerRepository.findManyAndCountByFilter({
        selectFields: [
          DB_FIELD.bannerName,
          DB_FIELD.bannerImage,
          DB_FIELD.description,
        ],
      });

      return banners;
    } catch (error) {
      throw handleError({
        operationName: 'InformationService.getBannerList',
        error,
      });
    }
  };

  static getServiceList = async (): Promise<Service[]> => {
    try {
      const [services] = await ServiceRepository.findManyAndCountByFilter({
        selectFields: [
          DB_FIELD.serviceCode,
          DB_FIELD.serviceName,
          DB_FIELD.serviceIcon,
          DB_FIELD.serviceTariff,
        ],
      });

      return services;
    } catch (error) {
      throw handleError({
        operationName: 'InformationService.getServiceList',
        error,
      });
    }
  };
}

export {InformationService};
