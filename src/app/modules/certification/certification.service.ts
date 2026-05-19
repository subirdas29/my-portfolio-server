import { TCertification } from './certification.interface';
import { Certification } from './certification.model';

const createCertification = async (payload: TCertification) => {
  const result = await Certification.create(payload);
  return result.toObject();
};

const getAllCertifications = async () => {
  return Certification.find().sort({ order: 1, createdAt: -1 }).lean();
};

const updateCertification = async (id: string, payload: Partial<TCertification>) => {
  return Certification.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
};

const deleteCertification = async (id: string) => {
  return Certification.findByIdAndDelete(id).lean();
};

export const CertificationServices = {
  createCertification,
  getAllCertifications,
  updateCertification,
  deleteCertification,
};
