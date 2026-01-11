import express from 'express';
import { ProjectValidation } from './project.validation';
import { ProjectController } from './project.controller';
import validationRequest from '../../middlewares/validateRequest';
import cache from '../../middlewares/cache';

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLES.user),
  validationRequest(ProjectValidation.projectSchema),
  ProjectController.createProjectController,
);


router.get('/', cache, ProjectController.getAllProjectController);
router.get('/project/:slug', cache, ProjectController.getSingleProjectController);

router.patch(
  '/edit-project/:id',
  // auth(USER_ROLES.user),
  validationRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateOwnProjectController,
);

router.patch(
  '/reorder',
  ProjectController.updateProjectOrderController
);

router.delete(
  '/:id',
  // auth(USER_ROLES.user),
  ProjectController.deleteOwnProjectController,
);

export const ProjectRoutes = router;