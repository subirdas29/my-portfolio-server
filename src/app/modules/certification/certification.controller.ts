import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CertificationServices } from './certification.service';

const createCertificationController = catchAsync(async (req, res) => {
  const result = await CertificationServices.createCertification(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Certification created successfully',
    data: result,
  });
});

const getAllCertificationsController = catchAsync(async (_req, res) => {
  const result = await CertificationServices.getAllCertifications();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certifications fetched successfully',
    data: result,
  });
});

const updateCertificationController = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CertificationServices.updateCertification(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certification updated successfully',
    data: result,
  });
});

const deleteCertificationController = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  await CertificationServices.deleteCertification(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certification deleted successfully',
    data: null,
  });
});

export const CertificationController = {
  createCertificationController,
  getAllCertificationsController,
  updateCertificationController,
  deleteCertificationController,
};
