import { Router } from 'express';
import { ClientController } from './client.controller';

const router: import("express").Router = Router();

router.get('/', ClientController.getAllClientsController);
router.post('/', ClientController.createClientController);
router.get('/:id/stats', ClientController.getClientWithStatsController);
router.get('/:id', ClientController.getClientByIdController);
router.patch('/:id', ClientController.updateClientController);
router.delete('/:id', ClientController.deleteClientController);

export const ClientRoutes = router;
