import { Router, Request, Response } from 'express';
import { uploadGenericFile } from '../../middlewares/upload.middleware';
import { uploadToCloudinary } from '../../config/cloudinary';

const router = Router();

router.post('/', uploadGenericFile, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const folder = req.body.folder || 'class-connect/uploads';
    const fileUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype, folder);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully to Cloudinary',
      url: fileUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
});

export const uploadRouter = router;
