import {Prisma} from '@prisma/client';

import {prismaClient} from '../configs/prisma-client';
import {logInfo} from '../utils/logger';
import {handleError} from '../utils/error-handler';

const insertBannersQuery = Prisma.sql`
INSERT INTO nutech_banners (banner_name, banner_image, description, updated_at)
VALUES
  ('Banner 1', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png', 'Lerem Ipsum Dolor sit amet', NOW()),
  ('Banner 2', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png', 'Lerem Ipsum Dolor sit amet', NOW()),
  ('Banner 3', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png', 'Lerem Ipsum Dolor sit amet', NOW()),
  ('Banner 4', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-4.png', 'Lerem Ipsum Dolor sit amet', NOW()),
  ('Banner 5', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-5.png', 'Lerem Ipsum Dolor sit amet', NOW());
`;

const insertServicesQuery = Prisma.sql`
INSERT INTO nutech_services (service_code, service_name, service_icon, service_tariff, updated_at)
VALUES
  ('PAJAK', 'Pajak PBB', 'https://minio.nutech-integrasi.com/take-home-test/services/PBB.png', 40000, NOW()),
  ('PLN', 'Listrik', 'https://minio.nutech-integrasi.com/take-home-test/services/Listrik.png', 10000, NOW()),
  ('PDAM', 'PDAM Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/PDAM.png', 40000, NOW()),
  ('PULSA', 'Pulsa', 'https://minio.nutech-integrasi.com/take-home-test/services/Pulsa.png', 40000, NOW()),
  ('PGN', 'PGN Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/PGN.png', 50000, NOW()),
  ('MUSIK', 'Musik Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/Musik.png', 50000, NOW()),
  ('TV', 'TV Berlangganan', 'https://minio.nutech-integrasi.com/take-home-test/services/Televisi.png', 50000, NOW()),
  ('PAKET_DATA', 'Paket Data', 'https://minio.nutech-integrasi.com/take-home-test/services/Paket-Data.png', 50000, NOW()),
  ('VOUCHER_GAME', 'Voucher Game', 'https://minio.nutech-integrasi.com/take-home-test/services/Game.png', 100000, NOW()),
  ('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://minio.nutech-integrasi.com/take-home-test/services/Voucher-Makanan.png', 100000, NOW()),
  ('QURBAN', 'Qurban', 'https://minio.nutech-integrasi.com/take-home-test/services/Qurban.png', 200000, NOW()),
  ('ZAKAT', 'Zakat', 'https://minio.nutech-integrasi.com/take-home-test/services/Zakat.png', 300000, NOW());
`;

const seedDatabase = async (): Promise<void> => {
  try {
    await prismaClient.$transaction([
      prismaClient.$executeRaw(insertBannersQuery),
      prismaClient.$executeRaw(insertServicesQuery),
    ]);

    logInfo('Seeding complete');
  } catch (error) {
    throw handleError({
      operationName: 'seedDatabase',
      error,
    });
  }
};

/** void: Explicitly ignore the return result of a function */
void seedDatabase();
