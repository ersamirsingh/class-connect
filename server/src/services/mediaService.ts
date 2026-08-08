import { config } from '../config';

export interface MediaUploadResult {
  assetId: string;
  url: string;
  playbackUrl?: string;
  provider: 'bunny_stream' | 'bunny_storage' | 'local_fallback';
  duration?: string;
}

export interface MediaUploadOptions {
  folder?: string;
  title?: string;
  mimeType?: string;
}

function encodeToDataUri(fileBuffer: Buffer, mimeType: string): string {
  const base64 = fileBuffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

export class MediaService {
  /**
   * Upload video file (Directs new videos to Bunny Stream, or fallback to Data URI)
   */
  static async uploadVideo(
    fileBuffer: Buffer,
    filename: string,
    options: MediaUploadOptions = {}
  ): Promise<MediaUploadResult> {
    const bunnyStreamApiKey = config.bunnyStreamApiKey?.trim();
    const bunnyStreamLibraryId = config.bunnyStreamLibraryId?.trim();
    const bunnyStreamCdnUrl = config.bunnyStreamCdnUrl?.trim() || 'https://iframe.mediadelivery.net';

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
        console.warn('Bunny Stream upload failed, utilizing local fallback:', err.message);
      }
    }

    // Fallback: Data URI for local dev/test environment
    const mimeType = options.mimeType || 'video/mp4';
    const fallbackUrl = encodeToDataUri(fileBuffer, mimeType);

    return {
      assetId: `video-${Date.now()}`,
      url: fallbackUrl,
      playbackUrl: fallbackUrl,
      provider: 'local_fallback',
    };
  }

  /**
   * Upload image file (Directs new images to Bunny Storage + CDN Pull Zone, or fallback to Data URI)
   */
  static async uploadImage(
    fileBuffer: Buffer,
    filename: string,
    options: MediaUploadOptions = {}
  ): Promise<MediaUploadResult> {
    const bunnyStorageApiKey = config.bunnyStorageApiKey?.trim();
    const bunnyStorageZone = config.bunnyStorageZone?.trim();
    const bunnyStorageCdnUrl = config.bunnyStorageCdnUrl?.trim();

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
          throw new Error(`Bunny Storage upload HTTP ${uploadRes.status}: ${uploadRes.statusText}`);
        }

        const cdnHost = bunnyStorageCdnUrl ? bunnyStorageCdnUrl.replace(/\/$/, '') : `https://${bunnyStorageZone}.b-cdn.net`;
        const cdnUrl = `${cdnHost}/${targetPath}`;

        return {
          assetId: targetPath,
          url: cdnUrl,
          provider: 'bunny_storage',
        };
      } catch (err: any) {
        console.warn('Bunny Storage upload failed, utilizing resilient media fallback:', err.message);
      }
    }

    // Resilient fallback: Data URI ensuring 100% image rendering
    const mimeType = options.mimeType || 'image/jpeg';
    const fallbackUrl = encodeToDataUri(fileBuffer, mimeType);

    return {
      assetId: `img-${Date.now()}`,
      url: fallbackUrl,
      provider: 'local_fallback',
    };
  }

  /**
   * Get formatted playback URL
   */
  static getPlaybackUrl(urlOrAssetId: string): string {
    if (!urlOrAssetId) return '';

    // Data URIs or standard HTTP(S) URLs return untouched
    if (
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
  static async deleteAsset(assetId: string, provider: 'bunny_stream' | 'bunny_storage' | 'local_fallback'): Promise<boolean> {
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

  /**
   * Diagnostic check for Bunny Stream & Bunny Storage connection status
   */
  static async checkBunnyConnections(): Promise<{
    stream: { configured: boolean; connected: boolean; statusText?: string };
    storage: { configured: boolean; connected: boolean; statusText?: string };
  }> {
    const bunnyStreamApiKey = config.bunnyStreamApiKey?.trim();
    const bunnyStreamLibraryId = config.bunnyStreamLibraryId?.trim();
    const bunnyStorageApiKey = config.bunnyStorageApiKey?.trim();
    const bunnyStorageZone = config.bunnyStorageZone?.trim();

    const result = {
      stream: { configured: !!(bunnyStreamApiKey && bunnyStreamLibraryId), connected: false, statusText: 'Not configured (using fallback)' },
      storage: { configured: !!(bunnyStorageApiKey && bunnyStorageZone), connected: false, statusText: 'Not configured (using fallback)' },
    };

    if (result.stream.configured) {
      try {
        const res = await fetch(`https://video.bunnycdn.com/library/${bunnyStreamLibraryId}/videos?page=1&itemsPerPage=1`, {
          headers: { AccessKey: bunnyStreamApiKey, accept: 'application/json' },
        });
        if (res.ok) {
          result.stream.connected = true;
          result.stream.statusText = 'Connected to Bunny Stream API successfully!';
        } else {
          result.stream.statusText = `Bunny Stream API HTTP ${res.status}: ${res.statusText}`;
        }
      } catch (err: any) {
        result.stream.statusText = `Bunny Stream connection failed: ${err.message}`;
      }
    }

    if (result.storage.configured) {
      try {
        const res = await fetch(`https://storage.bunnycdn.com/${bunnyStorageZone}/`, {
          headers: { AccessKey: bunnyStorageApiKey },
        });
        if (res.ok) {
          result.storage.connected = true;
          result.storage.statusText = 'Connected to Bunny Storage API successfully!';
        } else {
          result.storage.statusText = `Bunny Storage API HTTP ${res.status}: ${res.statusText}`;
        }
      } catch (err: any) {
        result.storage.statusText = `Bunny Storage connection failed: ${err.message}`;
      }
    }

    return result;
  }
}
