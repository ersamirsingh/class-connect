import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { MediaService } from '../services/mediaService';
import { CourseModel } from '../modules/course/course.model';
import { UserModel } from '../modules/user/user.model';
import { CategoryModel } from '../modules/category/category.model';
import { ReportModel } from '../modules/report/report.model';
import { DocumentVerificationModel } from '../modules/verification/documentVerification.model';

const ARTIFACTS_DIR = 'C:\\Users\\ersam\\.gemini\\antigravity\\brain\\5f478daf-7017-42cc-946f-3aeb0115427c';

// Mapping of generated high-res AI images
const GENERATED_IMAGES = {
  marketing: path.join(ARTIFACTS_DIR, 'course_google_ads_1786211155245.jpg'),
  ai: path.join(ARTIFACTS_DIR, 'course_ai_tools_178621182566.jpg'),
  design: path.join(ARTIFACTS_DIR, 'course_design_1786211212822.jpg'),
  sales: path.join(ARTIFACTS_DIR, 'course_sales_1786211237593.jpg'),
};

function getBufferForCourse(title: string): { buffer: Buffer; mimeType: string; filename: string } {
  const lower = title.toLowerCase();
  let imgPath = GENERATED_IMAGES.marketing;

  if (lower.includes('ai') || lower.includes('chatgpt') || lower.includes('prompt')) {
    imgPath = GENERATED_IMAGES.ai;
  } else if (lower.includes('canva') || lower.includes('design') || lower.includes('inshot') || lower.includes('editing')) {
    imgPath = GENERATED_IMAGES.design;
  } else if (lower.includes('sale') || lower.includes('freelance') || lower.includes('real estate') || lower.includes('objection')) {
    imgPath = GENERATED_IMAGES.sales;
  }

  if (fs.existsSync(imgPath)) {
    return {
      buffer: fs.readFileSync(imgPath),
      mimeType: 'image/jpeg',
      filename: `${path.basename(imgPath, '.jpg')}-${Date.now()}.jpg`,
    };
  }

  // High quality SVG image fallback if file doesn't exist
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#g)"/>
    <circle cx="400" cy="225" r="120" fill="#2563eb" opacity="0.15"/>
    <text x="400" y="220" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="400" y="260" font-family="Arial, sans-serif" font-size="16" fill="#38bdf8" text-anchor="middle">CLASS CONNECT PREMIUM COURSE</text>
  </svg>`;

  return {
    buffer: Buffer.from(svg),
    mimeType: 'image/svg+xml',
    filename: `course-${Date.now()}.svg`,
  };
}

function getAvatarBuffer(name: string): { buffer: Buffer; mimeType: string; filename: string } {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CC';
  const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706'];
  const color = colors[name.length % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 250 250">
    <rect width="250" height="250" rx="125" fill="${color}"/>
    <text x="125" y="145" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text>
  </svg>`;

  return {
    buffer: Buffer.from(svg),
    mimeType: 'image/svg+xml',
    filename: `avatar-${Date.now()}.svg`,
  };
}

async function reseedAllImages() {
  console.log('🖼️ ===================================================');
  console.log('🖼️ Reseeding High-Res & Real Images to Bunny Storage');
  console.log('🖼️ ===================================================\n');

  await mongoose.connect(config.mongoUri);
  console.log('📌 Connected to MongoDB database.\n');

  // 1. Reseed Course Thumbnails
  console.log('📦 1. Uploading High-Quality Course Thumbnails to Bunny Storage...');
  const courses = await CourseModel.find({});
  for (const course of courses) {
    console.log(`   Uploading thumbnail for course: "${course.title}"...`);
    const { buffer, mimeType, filename } = getBufferForCourse(course.title);
    
    const result = await MediaService.uploadImage(buffer, filename, {
      folder: 'course-thumbnails',
      mimeType,
    });

    console.log(`      ✅ Bunny Storage URL: ${result.url}`);
    
    await CourseModel.updateOne(
      { _id: course._id },
      { $set: { thumbnail: result.url } }
    );
  }
  console.log(`   💾 All ${courses.length} course thumbnails updated in MongoDB.\n`);

  // 2. Reseed User Avatars
  console.log('👤 2. Uploading User Avatars to Bunny Storage...');
  const users = await UserModel.find({});
  for (const user of users) {
    console.log(`   Uploading avatar for user: "${user.name}"...`);
    const { buffer, mimeType, filename } = getAvatarBuffer(user.name);

    const result = await MediaService.uploadImage(buffer, filename, {
      folder: 'avatars',
      mimeType,
    });

    console.log(`      ✅ Bunny Storage URL: ${result.url}`);

    await UserModel.updateOne(
      { _id: user._id },
      { $set: { photo: result.url } }
    );
  }
  console.log(`   💾 All ${users.length} user avatar photos updated in MongoDB.\n`);

  // 3. Reseed Problem Report Images
  console.log('🚩 3. Uploading Problem Report Attachment Images to Bunny Storage...');
  const reports = await ReportModel.find({});
  for (const report of reports) {
    if (report.images && report.images.length > 0) {
      console.log(`   Uploading report image attachment...`);
      const { buffer, mimeType, filename } = getBufferForCourse('Problem Report Attachment');

      const result = await MediaService.uploadImage(buffer, filename, {
        folder: 'report-images',
        mimeType,
      });

      console.log(`      ✅ Bunny Storage URL: ${result.url}`);

      await ReportModel.updateOne(
        { _id: report._id },
        { $set: { images: [result.url] } }
      );
    }
  }
  console.log(`   💾 Report attachment images updated in MongoDB.\n`);

  console.log('🎉 ===================================================');
  console.log('🎉 Reseeding Complete! All images uploaded to Bunny Storage.');
  console.log('🎉 ===================================================\n');

  await mongoose.disconnect();
}

reseedAllImages().catch((err) => {
  console.error('Fatal reseeding error:', err);
  mongoose.disconnect();
});
