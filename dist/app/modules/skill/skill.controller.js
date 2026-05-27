"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const skill_service_1 = require("./skill.service");
const CacheUtils_1 = require("../../utils/CacheUtils");
const createSkillController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await skill_service_1.SkillServices.createSkill(req.body);
    CacheUtils_1.CacheUtils.clearCache(['/api/v1/skills']);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Skill is created successfully', data: result });
});
const getAllSkill = (0, catchAsync_1.default)(async (req, res) => {
    const result = await skill_service_1.SkillServices.getAllSkill(req.query);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Skills fetched successfully', meta: result.meta, data: result.result });
});
const updateSkillOrderController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await skill_service_1.SkillServices.updateSkillOrder(req.body);
    CacheUtils_1.CacheUtils.clearCache(['/api/v1/skills']);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Skill order updated successfully', data: result });
});
const deleteOwnSkillController = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    await skill_service_1.SkillServices.getdeleteSkill(id);
    CacheUtils_1.CacheUtils.clearCache(['/api/v1/skills']);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Skill deleted successfully', data: null });
});
exports.SkillController = {
    createSkillController,
    getAllSkill,
    updateSkillOrderController,
    deleteOwnSkillController,
};
//# sourceMappingURL=skill.controller.js.map