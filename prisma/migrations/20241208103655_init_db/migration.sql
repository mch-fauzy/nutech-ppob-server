-- CreateTable
CREATE TABLE "nutech_users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "profile_image" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" TEXT,

    CONSTRAINT "nutech_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutech_services" (
    "id" SERIAL NOT NULL,
    "service_code" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "service_icon" TEXT NOT NULL,
    "service_tariff" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" TEXT,

    CONSTRAINT "nutech_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutech_banners" (
    "id" SERIAL NOT NULL,
    "banner_name" TEXT NOT NULL,
    "banner_image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" TEXT,

    CONSTRAINT "nutech_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutech_transactions" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "service_id" INTEGER NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" TEXT,

    CONSTRAINT "nutech_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nutech_users_email_key" ON "nutech_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "nutech_services_service_code_key" ON "nutech_services"("service_code");

-- CreateIndex
CREATE UNIQUE INDEX "nutech_banners_banner_name_key" ON "nutech_banners"("banner_name");

-- AddForeignKey
ALTER TABLE "nutech_transactions" ADD CONSTRAINT "nutech_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nutech_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutech_transactions" ADD CONSTRAINT "nutech_transactions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "nutech_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
