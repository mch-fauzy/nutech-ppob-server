"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCode = exports.serviceDbField = void 0;
// Read-only property
const serviceDbField = {
    id: 'id',
    serviceCode: 'service_code',
    serviceName: 'service_name',
    serviceIcon: 'service_icon',
    serviceTariff: 'service_tariff',
    createdAt: 'created_at',
    createdBy: 'created_by',
    updatedAt: 'updated_at',
    updatedBy: 'updated_by',
    deletedAt: 'deleted_at',
    deletedBy: 'deleted_by'
};
exports.serviceDbField = serviceDbField;
var ServiceCode;
(function (ServiceCode) {
    ServiceCode["PAJAK"] = "PAJAK";
    ServiceCode["PLN"] = "PLN";
    ServiceCode["PDAM"] = "PDAM";
    ServiceCode["PULSA"] = "PULSA";
    ServiceCode["PGN"] = "PGN";
    ServiceCode["MUSIK"] = "MUSIK";
    ServiceCode["TV"] = "TV";
    ServiceCode["PAKET_DATA"] = "PAKET_DATA";
    ServiceCode["VOUCHER_GAME"] = "VOUCHER_GAME";
    ServiceCode["VOUCHER_MAKANAN"] = "VOUCHER_MAKANAN";
    ServiceCode["QURBAN"] = "QURBAN";
    ServiceCode["ZAKAT"] = "ZAKAT";
})(ServiceCode || (exports.ServiceCode = ServiceCode = {}));
