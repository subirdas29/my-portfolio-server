"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationRoutes = void 0;
const express_1 = require("express");
const certification_controller_1 = require("./certification.controller");
const cache_1 = __importDefault(require("../../middlewares/cache"));
const router = (0, express_1.Router)();
router.post('/', certification_controller_1.CertificationController.createCertificationController);
router.get('/', cache_1.default, certification_controller_1.CertificationController.getAllCertificationsController);
router.patch('/:id', certification_controller_1.CertificationController.updateCertificationController);
router.delete('/:id', certification_controller_1.CertificationController.deleteCertificationController);
exports.CertificationRoutes = router;
//# sourceMappingURL=certification.route.js.map