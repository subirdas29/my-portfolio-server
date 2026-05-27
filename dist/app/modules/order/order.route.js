"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");

const router = express_1.default.Router();

router.get('/revenue/monthly', order_controller_1.OrderController.getRevenueByMonthController);
router.get('/', order_controller_1.OrderController.getAllOrdersController);
router.post('/', order_controller_1.OrderController.createOrderController);
router.get('/:id', order_controller_1.OrderController.getOrderByIdController);
router.patch('/:id', order_controller_1.OrderController.updateOrderController);
router.delete('/:id', order_controller_1.OrderController.deleteOrderController);
router.patch('/:id/milestones/:milestoneId', order_controller_1.OrderController.updateMilestoneController);
router.post('/:id/notes', order_controller_1.OrderController.addNoteController);
router.delete('/:id/notes/:noteId', order_controller_1.OrderController.deleteNoteController);

exports.OrderRoutes = router;
