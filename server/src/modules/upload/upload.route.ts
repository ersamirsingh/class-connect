import { Router, Request, Response } from 'express';
import { uploadGenericFile } from '../../middlewares/upload.middleware';
import { MediaService } from '../../services/mediaService';
import { config } from '../../config';

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

router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await MediaService.checkBunnyConnections();
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Image proxy endpoint: Fetches Bunny Storage assets with AccessKey header to bypass 403 CDN restrictions
router.get('/proxy', async (req: Request, res: Response) => {
  try {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      res.status(400).json({ success: false, message: 'Missing media URL parameter' });
      return;
    }

    const bunnyStorageApiKey = config.bunnyStorageApiKey?.trim();
    const bunnyStorageZone = config.bunnyStorageZone?.trim() || 'class-connect';

    let targetUrl = imageUrl;
    const headers: Record<string, string> = {};

    if (imageUrl.includes('.b-cdn.net/') || imageUrl.includes('storage.bunnycdn.com/')) {
      let pathPart = '';
      if (imageUrl.includes('.b-cdn.net/')) {
        pathPart = imageUrl.split('.b-cdn.net/')[1];
      } else {
        pathPart = imageUrl.split('storage.bunnycdn.com/')[1];
      }

      // Strip zone name prefix if duplicated in path
      if (pathPart.startsWith(`${bunnyStorageZone}/`)) {
        pathPart = pathPart.slice(bunnyStorageZone.length + 1);
      }

      targetUrl = `https://storage.bunnycdn.com/${bunnyStorageZone}/${pathPart}`;
      if (bunnyStorageApiKey) {
        headers['AccessKey'] = bunnyStorageApiKey;
      }
    }

    if (req.headers.range) {
      headers['Range'] = req.headers.range as string;
    }

    const response = await fetch(targetUrl, { headers });
    if (!response.ok && response.status !== 206) {
      res.status(response.status).json({ success: false, message: `Storage API HTTP ${response.status}: ${response.statusText}` });
      return;
    }

    const ext = imageUrl.split('?')[0].split('.').pop()?.toLowerCase();
    let contentType = response.headers.get('content-type') || 'application/octet-stream';
    if (ext === 'mp4') contentType = 'video/mp4';
    if (ext === 'webm') contentType = 'video/webm';
    if (ext === 'mov') contentType = 'video/quicktime';
    if (ext === 'jpeg' || ext === 'jpg') contentType = 'image/jpeg';
    if (ext === 'png') contentType = 'image/png';
    if (ext === 'webp') contentType = 'image/webp';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Accept-Ranges', 'bytes');

    if (response.headers.get('content-range')) {
      res.setHeader('Content-Range', response.headers.get('content-range')!);
      res.status(206);
    } else {
      res.status(200);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const uploadRouter = router;
