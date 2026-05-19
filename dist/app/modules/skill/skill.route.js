"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillRoutes = void 0;
const express_1 = __importDefault(require("express"));
const skill_controller_1 = require("./skill.controller");
const cache_1 = __importDefault(require("../../middlewares/cache")); // ক্যাশ মিডলওয়্যার ইমপোর্ট করুন
const router = express_1.default.Router();
router.post('/', 
// auth(USER_ROLES.user),
skill_controller_1.SkillController.createSkillController);
router.get('/', cache_1.default, skill_controller_1.SkillController.getAllSkill);
router.patch('/reorder', skill_controller_1.SkillController.updateSkillOrderController);
router.delete('/:id', 
// auth(USER_ROLES.user),
skill_controller_1.SkillController.deleteOwnSkillController);
exports.SkillRoutes = router;
