import {winstonLogger} from '../configs/winston';
import {Failure} from '../utils/failure';
import {BannerRepository} from '../repositories/banner-repository';
import {ServiceRepository} from '../repositories/service-repository';
import {bannerDbField} from '../models/banner-model';
import {serviceDbField} from '../models/service-model';

class InformationService {
  static getBannerList = async () => {
    try {
      const [banners] = await BannerRepository.findManyAndCountByFilter({
        selectFields: [
          bannerDbField.bannerName,
          bannerDbField.bannerImage,
          bannerDbField.description,
        ],
      });

      return banners;
    } catch (error) {
      winstonLogger.error(
        `[InformationService.getBannerList] Error retrieving banners: ${error}`,
      );
      throw Failure.internalServer('Failed to retrieve banners');
    }
  };

  static getServiceList = async () => {
    try {
      const [services] = await ServiceRepository.findManyAndCountByFilter({
        selectFields: [
          serviceDbField.serviceCode,
          serviceDbField.serviceName,
          serviceDbField.serviceIcon,
          serviceDbField.serviceTariff,
        ],
      });

      return services;
    } catch (error) {
      winstonLogger.error(
        `[InformationService.getServiceList] Error retrieving services: ${error}`,
      );
      throw Failure.internalServer('Failed to retrieve services');
    }
  };
}

export {InformationService};
