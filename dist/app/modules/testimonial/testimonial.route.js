"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialRoutes = void 0;
const express_1 = require("express");
const testimonial_controller_1 = require("./testimonial.controller");
const router = (0, express_1.Router)();
router.get('/', testimonial_controller_1.TestimonialController.getAllTestimonialsController);
router.post('/', testimonial_controller_1.TestimonialController.createTestimonialController);
router.patch('/:id/featured', testimonial_controller_1.TestimonialController.toggleFeaturedController);
router.patch('/:id', testimonial_controller_1.TestimonialController.updateTestimonialController);
router.delete('/:id', testimonial_controller_1.TestimonialController.deleteTestimonialController);
exports.TestimonialRoutes = router;
//# sourceMappingURL=testimonial.route.js.map