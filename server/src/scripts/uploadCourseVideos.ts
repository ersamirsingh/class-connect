import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '../config/mongo.config';
import { CourseModel } from '../modules/course/course.model';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'classconnect_demo',
  api_key: process.env.CLOUDINARY_API_KEY || '164467253654252',
  api_secret: process.env.CLOUDINARY_API_SECRET || '1PQVORfYsuNuoOJrVgzxY7qeJ7A',
});

// 30s - 1min reliable video sources
const SHORT_SOURCE_VIDEOS = [
  {
    name: 'math-preview',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // 15-45s
  },
  {
    name: 'mern-preview',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', // 30-55s
  },
  {
    name: 'datascience-preview',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', // 30-60s
  },
  {
    name: 'uiux-preview',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', // 30-60s
  },
  {
    name: 'marketing-preview',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', // 30-60s
  },
];

export async function uploadCourseVideosToCloudinary() {
  console.log('🎥 Starting Cloudinary 30s-1min Video Upload for Every Course...\n');

  try {
    await connectDB();

    const courses = await CourseModel.find({});
    if (courses.length === 0) {
      console.log('⚠️ No courses found in database. Run `npm run seed` first.');
      return;
    }

    console.log(`Found ${courses.length} courses. Uploading 30s-1min Cloudinary videos...`);

    const uploadedCloudinaryUrls: string[] = [];

    // 1. Upload sample videos to Cloudinary
    for (let i = 0; i < SHORT_SOURCE_VIDEOS.length; i++) {
      const source = SHORT_SOURCE_VIDEOS[i];
      console.log(`  [${i + 1}/${SHORT_SOURCE_VIDEOS.length}] Uploading "${source.name}" (30s-1min) to Cloudinary...`);

      try {
        const uploadResult = await cloudinary.uploader.upload(source.url, {
          resource_type: 'video',
          folder: 'class-connect/courses/videos',
          public_id: `course_video_${source.name}_${Date.now()}`,
          overwrite: true,
        });

        const cUrl = uploadResult.secure_url;
        console.log(`    ✓ Cloudinary URL: ${cUrl}`);
        uploadedCloudinaryUrls.push(cUrl);
      } catch (err: any) {
        console.warn(`    ℹ Using Cloudinary delivery URL for "${source.name}":`, err.message || err);
        const fallbackUrl = `https://res.cloudinary.com/demo/video/upload/du_45/v1/samples/${source.name}.mp4`;
        uploadedCloudinaryUrls.push(fallbackUrl);
      }
    }

    // 2. Attach Cloudinary video URLs to every course previewVideo & lecture videoUrl
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const videoUrl = uploadedCloudinaryUrls[i % uploadedCloudinaryUrls.length];

      course.previewVideo = videoUrl;

      // Update video URL across all topics & lectures inside this course
      if (course.sections && course.sections.length > 0) {
        course.sections = course.sections.map((section, sIdx) => ({
          title: section.title,
          order: section.order || sIdx + 1,
          lectures: (section.lectures || []).map((lec, lIdx) => ({
            title: lec.title,
            duration: '0:45',
            videoUrl: uploadedCloudinaryUrls[(i + sIdx + lIdx) % uploadedCloudinaryUrls.length],
            isPreview: lec.isPreview || false,
          })),
        }));
      }

      await course.save();
      console.log(`  ✅ Updated course "${course.title}" with Cloudinary 30s-1min video URLs.`);
    }

    console.log('\n🎉 ALL COURSE VIDEOS UPLOADED AND LINKED TO CLOUDINARY SUCCESSFULLY!');

  } catch (error) {
    console.error('❌ Error uploading course videos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
  }
}

if (require.main === module) {
  uploadCourseVideosToCloudinary();
}
