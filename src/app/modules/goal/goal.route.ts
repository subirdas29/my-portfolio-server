import { Router } from 'express';
import { GoalController } from './goal.controller';

const router = Router();
router.get('/', GoalController.getAllGoalsController);
router.post('/', GoalController.createGoalController);
router.post('/sync', GoalController.syncGoalsController);
router.patch('/:id', GoalController.updateGoalController);
router.delete('/:id', GoalController.deleteGoalController);

export const GoalRoutes = router;
