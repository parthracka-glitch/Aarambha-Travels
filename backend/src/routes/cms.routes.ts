import { Router } from 'express';
import { CMSController } from '../controllers/cms.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/content/:section_key', CMSController.getContent);
router.post('/content', requireSuperAdmin, CMSController.saveContent);
router.get('/blogs', CMSController.listBlogs);
router.post('/blogs', requireSuperAdmin, CMSController.createBlog);

export default router;
