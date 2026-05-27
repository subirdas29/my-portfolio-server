import express from 'express';
import { SkillController } from './skill.controller';
import cache from '../../middlewares/cache';

const router: import("express").Router = express.Router();

router.post('/', SkillController.createSkillController);
router.get('/', cache, SkillController.getAllSkill);
router.patch('/reorder', SkillController.updateSkillOrderController);
router.delete('/:id', SkillController.deleteOwnSkillController);

export const SkillRoutes = router;
