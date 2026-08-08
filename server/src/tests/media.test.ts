import { MediaService } from '../services/mediaService';

describe('14. Bunny.net / MediaService Abstraction Layer Module', () => {
  it('Phase 1 Check: getPlaybackUrl preserves existing Cloudinary URLs untouched', () => {
    const cloudinaryUrl = 'https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp4';
    const result = MediaService.getPlaybackUrl(cloudinaryUrl);
    expect(result).toBe(cloudinaryUrl);
  });

  it('Phase 1 Check: getPlaybackUrl preserves data URIs untouched', () => {
    const dataUri = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD';
    const result = MediaService.getPlaybackUrl(dataUri);
    expect(result).toBe(dataUri);
  });

  it('Phase 1 Check: uploadImage returns valid asset result through abstraction layer', async () => {
    const fakeBuffer = Buffer.from('fake image content');
    const result = await MediaService.uploadImage(fakeBuffer, 'test.jpg', { folder: 'tests' });
    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('provider');
  });

  it('Phase 1 Check: uploadVideo returns valid asset result through abstraction layer', async () => {
    const fakeBuffer = Buffer.from('fake video content');
    const result = await MediaService.uploadVideo(fakeBuffer, 'test.mp4', { folder: 'tests' });
    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('provider');
  });
});
