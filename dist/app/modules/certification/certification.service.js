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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationServices = void 0;
const certification_model_1 = require("./certification.model");

const createCertification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield certification_model_1.Certification.create(payload);
    return result.toObject();
});

const getAllCertifications = () => __awaiter(void 0, void 0, void 0, function* () {
    return certification_model_1.Certification.find().sort({ order: 1, createdAt: -1 }).lean();
});

const updateCertification = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return certification_model_1.Certification.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
});

const deleteCertification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return certification_model_1.Certification.findByIdAndDelete(id).lean();
});

exports.CertificationServices = {
    createCertification,
    getAllCertifications,
    updateCertification,
    deleteCertification,
};
