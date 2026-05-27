import { Router } from 'express';
import { SettingsController } from './settings.controller';

const router = Router();
router.get('/', SettingsController.getSettingsController);
router.patch('/', SettingsController.updateSettingsController);

export const SettingsRoutes = router;
