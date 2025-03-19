// import validationRequest from "../../middlewares/validateRequest";
import express from 'express';
import { SkillController } from "./skill.controller";
// import { SkillValidation } from "./skill.validation";


const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLES.user),

//   validationRequest(SkillValidation.skillSchema),
  SkillController.createSkillController,
);

router.get('/', SkillController.getAllSkill);

router.delete(
  '/:id',
  // auth(USER_ROLES.user),
  SkillController.deleteOwnSkillController,
);

export const SkillRoutes = router;