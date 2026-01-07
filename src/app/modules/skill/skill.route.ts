import express from 'express';
import { SkillController } from "./skill.controller";
import cache from '../../middlewares/cache'; // ক্যাশ মিডলওয়্যার ইমপোর্ট করুন

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLES.user),
  SkillController.createSkillController,
);


router.get('/', cache, SkillController.getAllSkill);

router.patch(
  '/reorder',
  SkillController.updateSkillOrderController
);

router.delete(
  '/:id',
  // auth(USER_ROLES.user),
  SkillController.deleteOwnSkillController,
);

export const SkillRoutes = router;