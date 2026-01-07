import express from 'express';
import multer from 'multer';
import { FileUploadController } from './fileUpload.controller';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } 
});

router.post(
  '/image', 
  upload.single('file'), 
  FileUploadController.uploadImage
);

router.post(
  '/upload-raw', 
  upload.single('file'), 
  FileUploadController.uploadRawFile
);

router.delete(
  '/delete', 
  FileUploadController.deleteFile
);

export const fileUploadRoutes = router;