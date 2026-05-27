import { Router } from 'express';
import { SettingsController } from './settings.controller';

const router: import("express").Router = Router();
router.get('/', SettingsController.getSettingsController);
router.patch('/', SettingsController.updateSettingsController);

export const SettingsRoutes = router;
