import { Router } from 'express';
import { CertificationController } from './certification.controller';
import cache from '../../middlewares/cache';

const router = Router();

router.post('/', CertificationController.createCertificationController);
router.get('/', cache, CertificationController.getAllCertificationsController);
router.patch('/:id', CertificationController.updateCertificationController);
router.delete('/:id', CertificationController.deleteCertificationController);

export const CertificationRoutes = router;
