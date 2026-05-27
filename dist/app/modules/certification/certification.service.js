"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationServices = void 0;
const certification_model_1 = require("./certification.model");
const createCertification = async (payload) => {
    const result = await certification_model_1.Certification.create(payload);
    return result.toObject();
};
const getAllCertifications = async () => {
    return certification_model_1.Certification.find().sort({ order: 1, createdAt: -1 }).lean();
};
const updateCertification = async (id, payload) => {
    return certification_model_1.Certification.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
};
const deleteCertification = async (id) => {
    return certification_model_1.Certification.findByIdAndDelete(id).lean();
};
exports.CertificationServices = {
    createCertification,
    getAllCertifications,
    updateCertification,
    deleteCertification,
};
//# sourceMappingURL=certification.service.js.map