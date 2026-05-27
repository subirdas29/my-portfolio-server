"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_controller_1 = require("./client.controller");

const router = express_1.default.Router();

router.get('/', client_controller_1.ClientController.getAllClientsController);
router.post('/', client_controller_1.ClientController.createClientController);
router.get('/:id/stats', client_controller_1.ClientController.getClientWithStatsController);
router.get('/:id', client_controller_1.ClientController.getClientByIdController);
router.patch('/:id', client_controller_1.ClientController.updateClientController);
router.delete('/:id', client_controller_1.ClientController.deleteClientController);

exports.ClientRoutes = router;
