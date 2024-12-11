"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageFilename = void 0;
const path_1 = __importDefault(require("path"));
const generateImageFilename = (file) => {
    const timestamp = Date.now().toString();
    return `${timestamp}${path_1.default.extname(file.originalname)}`;
};
exports.generateImageFilename = generateImageFilename;
