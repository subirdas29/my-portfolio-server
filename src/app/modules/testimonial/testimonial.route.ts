import { Router } from 'express';
import { TestimonialController } from './testimonial.controller';

const router = Router();
router.get('/', TestimonialController.getAllTestimonialsController);
router.post('/', TestimonialController.createTestimonialController);
router.patch('/:id/featured', TestimonialController.toggleFeaturedController);
router.patch('/:id', TestimonialController.updateTestimonialController);
router.delete('/:id', TestimonialController.deleteTestimonialController);

export const TestimonialRoutes = router;
