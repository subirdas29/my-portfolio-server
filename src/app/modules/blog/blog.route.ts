import express from 'express';
import { BlogController } from './blog.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './blog.validation';
import cache from '../../middlewares/cache';

const router: import("express").Router = express.Router();

router.get('/analytics', BlogController.getBlogAnalyticsController);
router.post('/', validateRequest(BlogValidation.blogSchema), BlogController.createBlogController);
router.patch('/edit-blog/:id', validateRequest(BlogValidation.updateBlogSchema), BlogController.updateOwnBlogController);
router.delete('/:id', BlogController.deleteOwnBlogController);
router.get('/', cache, BlogController.getAllBlogController);
router.get('/blog/:slug', cache, BlogController.getSingleBlog);

export const BlogRoutes = router;
