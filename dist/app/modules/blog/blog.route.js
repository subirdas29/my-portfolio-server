"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const blog_validation_1 = require("./blog.validation");
const cache_1 = __importDefault(require("../../middlewares/cache"));
const router = express_1.default.Router();
router.get('/analytics', blog_controller_1.BlogController.getBlogAnalyticsController);
router.post('/', (0, validateRequest_1.default)(blog_validation_1.BlogValidation.blogSchema), blog_controller_1.BlogController.createBlogController);
router.patch('/edit-blog/:id', (0, validateRequest_1.default)(blog_validation_1.BlogValidation.updateBlogSchema), blog_controller_1.BlogController.updateOwnBlogController);
router.delete('/:id', blog_controller_1.BlogController.deleteOwnBlogController);
router.get('/', cache_1.default, blog_controller_1.BlogController.getAllBlogController);
router.get('/blog/:slug', cache_1.default, blog_controller_1.BlogController.getSingleBlog);
exports.BlogRoutes = router;
//# sourceMappingURL=blog.route.js.map