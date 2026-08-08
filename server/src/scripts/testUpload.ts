import 'dotenv/config';
import { MediaService } from '../services/mediaService';

async function testUploads() {
  console.log('🚀 Testing MediaService uploads...\n');

  // Test 1: Image Upload
  console.log('📸 Uploading test image...');
  const imageBuffer = Buffer.from('fake test image data');
  const imgResult = await MediaService.uploadImage(imageBuffer, 'test-photo.jpg', { folder: 'test' });
  console.log('   Image Upload Result:', imgResult);

  // Test 2: Video Upload
  console.log('\n🎥 Uploading test video metadata/stream...');
  const videoBuffer = Buffer.from('fake test video data');
  const videoResult = await MediaService.uploadVideo(videoBuffer, 'test-video.mp4', { folder: 'test' });
  console.log('   Video Upload Result:', videoResult);
}

testUploads().catch(console.error);
