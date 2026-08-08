import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { CourseModel } from '../modules/course/course.model';
import { CategoryModel } from '../modules/category/category.model';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const artifactDir = 'C:\\Users\\ersam\\.gemini\\antigravity\\brain\\5f478daf-7017-42cc-946f-3aeb0115427c';

function getFileAsDataUri(filename: string): string {
  const filePath = path.join(artifactDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return '';
  }
  const buffer = fs.readFileSync(filePath);
  const base64 = buffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

async function applyImages() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ClassConnect';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);

  console.log('Loading AI-generated course images...');
  const imageGoogleAds = getFileAsDataUri('course_google_ads_1786211155245.jpg');
  const imageAiTools = getFileAsDataUri('course_ai_tools_1786211182566.jpg');
  const imageDesign = getFileAsDataUri('course_design_1786211212822.jpg');
  const imageSales = getFileAsDataUri('course_sales_1786211237593.jpg');

  console.log('Fetching all courses from MongoDB...');
  const courses = await CourseModel.find({});
  console.log(`Found ${courses.length} courses in database.`);

  let updatedCount = 0;

  for (const course of courses) {
    const title = (course.title || '').toLowerCase();
    let selectedImage = imageGoogleAds; // Default fallback

    if (
      title.includes('ai') || 
      title.includes('prompt') || 
      title.includes('chatgpt') || 
      title.includes('youtube') || 
      title.includes('instagram') ||
      title.includes('resume')
    ) {
      selectedImage = imageAiTools;
    } else if (
      title.includes('canva') || 
      title.includes('design') || 
      title.includes('video') || 
      title.includes('capcut') || 
      title.includes('inshot') ||
      title.includes('react')
    ) {
      selectedImage = imageDesign;
    } else if (
      title.includes('sale') || 
      title.includes('lead') || 
      title.includes('objection') || 
      title.includes('freelanc') || 
      title.includes('hr') || 
      title.includes('communication') || 
      title.includes('mindset') || 
      title.includes('excel') ||
      title.includes('estate')
    ) {
      selectedImage = imageSales;
    } else {
      selectedImage = imageGoogleAds;
    }

    await CourseModel.updateOne(
      { _id: course._id },
      { $set: { thumbnail: selectedImage } }
    );
    console.log(` ✅ Updated thumbnail for course: "${course.title}"`);
    updatedCount++;
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} course thumbnails with AI-generated course artwork!`);
  await mongoose.disconnect();
}

applyImages().catch(err => {
  console.error('Error applying course images:', err);
  process.exit(1);
});
