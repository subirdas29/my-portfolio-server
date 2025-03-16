import express from 'express';
import { BlogController } from './blog.controller';
// import auth from '../../middlewares/auth';
// import { USER_ROLES } from '../User/user.constant';
import validationRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './blog.validation';
// import { BlogValidation } from './blog.validation';



const router = express.Router();

router.post('/',
    // auth(USER_ROLES.user),

validationRequest(BlogValidation.blogSchema), BlogController.createBlogController);

router.patch('/edit-blog/:id',
    // auth(USER_ROLES.user),
    validationRequest(BlogValidation.updateBlogSchema),BlogController.updateOwnBlogController);

router.delete('/:id',
    // auth(USER_ROLES.user),
    BlogController.deleteOwnBlogController);

router.get('/', BlogController.getAllBlogController);

export const BlogRoutes = router;
