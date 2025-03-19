import express from 'express';

// import auth from '../../middlewares/auth';
// import { USER_ROLES } from '../User/user.constant';
import validationRequest from '../../middlewares/validateRequest';
import { ProjectValidation } from './project.validation';
import { ProjectController } from './project.controller';

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLES.user),

  validationRequest(ProjectValidation.projectSchema),
  ProjectController.createProjectController,
);
router.get('/', ProjectController.getAllProjectController);
router.get('/project/:projectId', ProjectController.getSingleProjectController);

router.patch(
  '/edit-project/:id',
  // auth(USER_ROLES.user),
  validationRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateOwnProjectController,
);

router.delete(
  '/:id',
  // auth(USER_ROLES.user),
  ProjectController.deleteOwnProjectController,
);



export const ProjectRoutes = router;
