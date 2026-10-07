import { Router, Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { uploadBufferToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from '../config/cloudinary';

const router = Router();

// Memory storage keeps file buffers in RAM to stream directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'image/gif',
    'image/svg+xml',
    'image/avif',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPG, PNG, WEBP, GIF, SVG`));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per image
    files: 10,
  },
  fileFilter,
});

/**
 * GET /api/upload/status
 * Check if Cloudinary credentials are configured
 */
router.get('/status', (_req: Request, res: Response) => {
  const configured = isCloudinaryConfigured();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || null;
  res.json({
    status: 'ok',
    configured,
    cloudName,
    message: configured
      ? 'Cloudinary image storage service is active and ready'
      : 'Cloudinary credentials missing or incomplete (CLOUDINARY_CLOUD_NAME required)',
  });
});

/**
 * POST /api/upload
 * Single photo upload endpoint
 */
router.post(
  '/',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No image file uploaded in field "file"' });
        return;
      }

      if (!isCloudinaryConfigured()) {
        res.status(503).json({
          success: false,
          error: 'Cloudinary storage is not configured. Please supply CLOUDINARY_CLOUD_NAME in environment settings.',
        });
        return;
      }

      const folder = (req.body.folder as string) || 'aarambha_travels';
      const filename = req.file.originalname;

      const uploadResult = await uploadBufferToCloudinary(
        req.file.buffer,
        folder,
        filename
      );

      res.status(201).json({
        success: true,
        url: uploadResult.secure_url,
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * POST /api/upload/multiple
 * Batch photo upload endpoint (up to 10 photos)
 */
router.post(
  '/multiple',
  upload.array('files', 10),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, error: 'No files provided in "files" field' });
        return;
      }

      if (!isCloudinaryConfigured()) {
        res.status(503).json({
          success: false,
          error: 'Cloudinary storage is not configured. Please supply CLOUDINARY_CLOUD_NAME in environment settings.',
        });
        return;
      }

      const folder = (req.body.folder as string) || 'aarambha_travels';

      const uploadPromises = files.map((file) =>
        uploadBufferToCloudinary(file.buffer, folder, file.originalname)
      );

      const results = await Promise.all(uploadPromises);

      res.status(201).json({
        success: true,
        count: results.length,
        images: results.map((r) => ({
          url: r.secure_url,
          secure_url: r.secure_url,
          public_id: r.public_id,
          format: r.format,
          width: r.width,
          height: r.height,
          bytes: r.bytes,
        })),
      });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * DELETE /api/upload/:publicId
 * Delete photo from Cloudinary
 */
router.delete('/:publicId(*)', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      res.status(400).json({ success: false, error: 'publicId is required' });
      return;
    }

    if (!isCloudinaryConfigured()) {
      res.status(503).json({ success: false, error: 'Cloudinary not configured' });
      return;
    }

    const deleteResult = await deleteFromCloudinary(publicId);
    res.json({
      success: true,
      result: deleteResult,
      message: `Deleted image ${publicId}`,
    });
  } catch (err: any) {
    next(err);
  }
});

export default router;
