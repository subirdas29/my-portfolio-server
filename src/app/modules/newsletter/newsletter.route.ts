import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';

const router: Router = Router();

router.post('/subscribe', NewsletterController.subscribeController);
router.post('/unsubscribe', NewsletterController.unsubscribeController);
router.post('/broadcast', NewsletterController.broadcastController);
router.get('/', NewsletterController.getAllSubscribersController);

export const NewsletterRoutes = router;
