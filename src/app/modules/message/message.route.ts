import express from 'express';

// import auth from '../../middlewares/auth';
// import { USER_ROLES } from '../User/user.constant';
// import validationRequest from '../../middlewares/validateRequest';
// import { MessageValidation } from './message.validation';
import { MessageController } from './message.controller';

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLES.user),

  // validationRequest(MessageValidation.MessageSchema),
  MessageController.createMessageController,
);

router.patch('/:id/status', MessageController.updateMessageStatusController);

router.delete(
  '/:id',
  // auth(USER_ROLES.user),
  MessageController.deleteOwnMessageController,
);

router.get('/', MessageController.getAllMessageController);

export const MessageRoutes = router;
