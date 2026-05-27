import { Router } from 'express';
import { OrderController } from './order.controller';

const router: import("express").Router = Router();

router.get('/revenue/monthly', OrderController.getRevenueByMonthController);
router.get('/', OrderController.getAllOrdersController);
router.post('/', OrderController.createOrderController);
router.get('/:id', OrderController.getOrderByIdController);
router.patch('/:id', OrderController.updateOrderController);
router.delete('/:id', OrderController.deleteOrderController);
router.patch('/:id/milestones/:milestoneId', OrderController.updateMilestoneController);
router.post('/:id/notes', OrderController.addNoteController);
router.delete('/:id/notes/:noteId', OrderController.deleteNoteController);

export const OrderRoutes = router;
