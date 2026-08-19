import { Request, Response, NextFunction } from 'express';
import { CMSService } from '../services/cms.service';

export class CMSController {
  static async getContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const content = await CMSService.getContentBySectionKey(req.params.section_key);
      res.json(content);
    } catch (err) {
      next(err);
    }
  }

  static async saveContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await CMSService.saveContent(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async listBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogs = await CMSService.listBlogs();
      res.json(blogs);
    } catch (err) {
      next(err);
    }
  }

  static async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blog = await CMSService.createBlog(req.body);
      res.status(201).json(blog);
    } catch (err) {
      next(err);
    }
  }
}
