import { Router, Request, Response } from 'express';
import { uploadGenericFile } from '../../middlewares/upload.middleware';
import { MediaService } from '../../services/mediaService';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  uploadGenericFile(req, res, async (err: any) => {
    if (err) {
      res.status(400).json({ success: false, message: err.message || 'File upload validation error' });
      return;
    }

    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded.' });
        return;
      }

      const folder = req.body.folder || 'class-connect/uploads';
      const isVideo = req.file.mimetype.startsWith('video/');

      const result = isVideo
        ? await MediaService.uploadVideo(req.file.buffer, req.file.originalname, { mimeType: req.file.mimetype, folder })
        : await MediaService.uploadImage(req.file.buffer, req.file.originalname, { mimeType: req.file.mimetype, folder });

      res.status(200).json({
        success: true,
        message: `File uploaded successfully via ${result.provider}`,
        url: result.url,
        playbackUrl: result.playbackUrl,
        assetId: result.assetId,
        provider: result.provider,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Upload failed' });
    }
  });
});

export const uploadRouter = router;
