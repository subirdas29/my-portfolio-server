"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalRoutes = void 0;
const express_1 = require("express");
const goal_controller_1 = require("./goal.controller");
const router = (0, express_1.Router)();
router.get('/', goal_controller_1.GoalController.getAllGoalsController);
router.post('/', goal_controller_1.GoalController.createGoalController);
router.post('/sync', goal_controller_1.GoalController.syncGoalsController);
router.patch('/:id', goal_controller_1.GoalController.updateGoalController);
router.delete('/:id', goal_controller_1.GoalController.deleteGoalController);
exports.GoalRoutes = router;
//# sourceMappingURL=goal.route.js.map