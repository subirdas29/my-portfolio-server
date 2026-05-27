"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRoutes = void 0;
const express_1 = require("express");
const client_controller_1 = require("./client.controller");
const router = (0, express_1.Router)();
router.get('/', client_controller_1.ClientController.getAllClientsController);
router.post('/', client_controller_1.ClientController.createClientController);
router.get('/:id/stats', client_controller_1.ClientController.getClientWithStatsController);
router.get('/:id', client_controller_1.ClientController.getClientByIdController);
router.patch('/:id', client_controller_1.ClientController.updateClientController);
router.delete('/:id', client_controller_1.ClientController.deleteClientController);
exports.ClientRoutes = router;
//# sourceMappingURL=client.route.js.map