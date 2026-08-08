import { config } from '../config';
import { uploadToCloudinary } from '../config/cloudinary';

export interface MediaUploadResult {
  assetId: string;
  url: string;
  playbackUrl?: string;
  provider: 'bunny_stream' | 'bunny_storage' | 'cloudinary' | 'local_fallback';
  duration?: string;
}

export interface MediaUploadOptions {
  folder?: string;
  title?: string;
  mimeType?: string;
}

export class MediaService {
  /**
   * Upload video file (Directs new videos to Bunny Stream, or fallback to Cloudinary/Data URI)
   */
  static async uploadVideo(
    fileBuffer: Buffer,
    filename: string,
    options: MediaUploadOptions = {}
  ): Promise<MediaUploadResult> {
    const { bunnyStreamApiKey, bunnyStreamLibraryId, bunnyStreamCdnUrl } = config;

    // Direct new video uploads to Bunny Stream if API keys are configured
    if (bunnyStreamApiKey && bunnyStreamLibraryId) {
      try {
        const title = options.title || filename || `video-${Date.now()}`;
        
        // Step 1: Create video object in Bunny Stream Library
        const createRes = await fetch(`https://video.bunnycdn.com/library/${bunnyStreamLibraryId}/videos`, {
          method: 'POST',
          headers: {
            AccessKey: bunnyStreamApiKey,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({ title }),
        });

        if (!createRes.ok) {
          throw new Error(`Bunny Stream create video error: ${createRes.statusText}`);
        }

        const createData: any = await createRes.json();
        const videoId = createData.guid || createData.id;

        // Step 2: Upload binary payload to Bunny Stream
        const uploadRes = await fetch(`https://video.bunnycdn.com/library/${bunnyStreamLibraryId}/videos/${videoId}`, {
          method: 'PUT',
          headers: {
            AccessKey: bunnyStreamApiKey,
            'Content-Type': options.mimeType || 'application/octet-stream',
          },
          body: fileBuffer as any,
        });

        if (!uploadRes.ok) {
          throw new Error(`Bunny Stream upload binary error: ${uploadRes.statusText}`);
        }

        const playbackUrl = `${bunnyStreamCdnUrl}/embed/${bunnyStreamLibraryId}/${videoId}`;

        return {
          assetId: videoId,
          url: playbackUrl,
          playbackUrl,
          provider: 'bunny_stream',
        };
      } catch (err: any) {
        console.warn('Bunny Stream upload failed, falling back to Cloudinary/local fallback:', err.message);
      }
    }

    // Fallback: Cloudinary or Data URI for local dev/test environment
    const mimeType = options.mimeType || 'video/mp4';
    const fallbackUrl = await uploadToCloudinary(fileBuffer, mimeType, options.folder || 'videos');
    const isCloudinary = fallbackUrl.includes('cloudinary.com');

    return {
      assetId: `video-${Date.now()}`,
      url: fallbackUrl,
      playbackUrl: fallbackUrl,
      provider: isCloudinary ? 'cloudinary' : 'local_fallback',
    };
  }

  /**
   * Upload image file (Directs new images to Bunny Storage + CDN Pull Zone, or fallback to Cloudinary/Data URI)
   */
  static async uploadImage(
    fileBuffer: Buffer,
    filename: string,
    options: MediaUploadOptions = {}
  ): Promise<MediaUploadResult> {
    const { bunnyStorageApiKey, bunnyStorageZone, bunnyStorageCdnUrl } = config;

    // Direct new image uploads to Bunny Storage if API keys are configured
    if (bunnyStorageApiKey && bunnyStorageZone) {
      try {
        const folder = options.folder ? `${options.folder.replace(/^\/|\/$/g, '')}/` : '';
        const cleanFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '')}`;
        const targetPath = `${folder}${cleanFilename}`;

        const uploadRes = await fetch(`https://storage.bunnycdn.com/${bunnyStorageZone}/${targetPath}`, {
          method: 'PUT',
          headers: {
            AccessKey: bunnyStorageApiKey,
            'Content-Type': options.mimeType || 'image/jpeg',
          },
          body: fileBuffer as any,
        });

        if (!uploadRes.ok) {
          throw new Error(`Bunny Storage upload error: ${uploadRes.statusText}`);
        }

        const cdnHost = bunnyStorageCdnUrl ? bunnyStorageCdnUrl.replace(/\/$/, '') : `https://${bunnyStorageZone}.b-cdn.net`;
        const cdnUrl = `${cdnHost}/${targetPath}`;

        return {
          assetId: targetPath,
          url: cdnUrl,
          provider: 'bunny_storage',
        };
      } catch (err: any) {
        console.warn('Bunny Storage upload failed, falling back to Cloudinary/local fallback:', err.message);
      }
    }

    // Fallback: Cloudinary or Data URI
    const mimeType = options.mimeType || 'image/jpeg';
    const fallbackUrl = await uploadToCloudinary(fileBuffer, mimeType, options.folder || 'images');
    const isCloudinary = fallbackUrl.includes('cloudinary.com');

    return {
      assetId: `img-${Date.now()}`,
      url: fallbackUrl,
      provider: isCloudinary ? 'cloudinary' : 'local_fallback',
    };
  }

  /**
   * Get formatted playback URL (Guarantees backward compatibility for existing Cloudinary URLs untouched)
   */
  static getPlaybackUrl(urlOrAssetId: string): string {
    if (!urlOrAssetId) return '';

    // Existing Cloudinary URLs, data URIs, or standard URLs return untouched as-is
    if (
      urlOrAssetId.includes('cloudinary.com') ||
      urlOrAssetId.startsWith('data:') ||
      urlOrAssetId.startsWith('http://') ||
      urlOrAssetId.startsWith('https://')
    ) {
      return urlOrAssetId;
    }

    // Bunny Stream video GUID string -> return iframe playback URL
    if (config.bunnyStreamLibraryId && /^[a-f0-9-]{36}$/i.test(urlOrAssetId)) {
      return `${config.bunnyStreamCdnUrl}/embed/${config.bunnyStreamLibraryId}/${urlOrAssetId}`;
    }

    return urlOrAssetId;
  }

  /**
   * Delete asset from provider
   */
  static async deleteAsset(assetId: string, provider: 'bunny_stream' | 'bunny_storage' | 'cloudinary' | 'local_fallback'): Promise<boolean> {
    if (!assetId) return false;

    if (provider === 'bunny_stream' && config.bunnyStreamApiKey && config.bunnyStreamLibraryId) {
      try {
        const res = await fetch(`https://video.bunnycdn.com/library/${config.bunnyStreamLibraryId}/videos/${assetId}`, {
          method: 'DELETE',
          headers: { AccessKey: config.bunnyStreamApiKey },
        });
        return res.ok;
      } catch (err) {
        return false;
      }
    }

    if (provider === 'bunny_storage' && config.bunnyStorageApiKey && config.bunnyStorageZone) {
      try {
        const res = await fetch(`https://storage.bunnycdn.com/${config.bunnyStorageZone}/${assetId}`, {
          method: 'DELETE',
          headers: { AccessKey: config.bunnyStorageApiKey },
        });
        return res.ok;
      } catch (err) {
        return false;
      }
    }

    return true;
  }
}
