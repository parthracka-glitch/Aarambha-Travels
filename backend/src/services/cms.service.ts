import { CMSContent, BlogPost } from '../models';

export class CMSService {
  static async getContentBySectionKey(sectionKey: string) {
    const content = await CMSContent.findOne({ sectionKey });
    if (!content) {
      return { section_key: sectionKey, title: '', content: {} };
    }
    return content;
  }

  static async saveContent(body: any) {
    const { section_key, sectionKey, title, content } = body;
    const key = section_key || sectionKey;

    const item = await CMSContent.findOneAndUpdate(
      { sectionKey: key },
      { title, content, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return { message: 'CMS content saved', item };
  }

  static async listBlogs() {
    return BlogPost.find({ isPublished: true }).sort({ createdAt: -1 });
  }

  static async createBlog(body: any) {
    const { slug, title, summary, content, cover_image, coverImage, author } = body;
    return BlogPost.create({
      slug,
      title,
      summary,
      content,
      coverImage: cover_image || coverImage,
      author: author || 'Aarambha Team',
      isPublished: true,
    });
  }
}
