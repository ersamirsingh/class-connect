import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const bunnyStorageApiKey = '549dd8a8-06e1-4f61-99849942ab86-ca44-4d3c';
const bunnyStorageZone = 'class-connect';
const bunnyCdnHost = 'https://class-connect.b-cdn.net';
const mongoUri = 'mongodb://mainhunloki:Sam4Code00@ac-avpidra-shard-00-00.7xcxlt8.mongodb.net:27017,ac-avpidra-shard-00-01.7xcxlt8.mongodb.net:27017,ac-avpidra-shard-00-02.7xcxlt8.mongodb.net:27017/class-connect?ssl=true&authSource=admin';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    icon: { type: String, default: 'Code' },
    color: { type: String, default: '#3730E0' },
    coverImage: { type: String, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.models.Category || model('Category', categorySchema);

const localCategoryDir = path.resolve(process.cwd(), '../client/public/assets/categories');

const categoryDefinitions = [
  {
    name: 'Web Development',
    slug: 'web-development',
    file: 'web-development.jpg',
    color: '#EF4444',
    icon: 'Code',
    description: 'HTML, CSS, React 19, Node.js & Next.js 15',
  },
  {
    name: 'App Development',
    slug: 'app-development',
    file: 'app-development.jpg',
    color: '#10B981',
    icon: 'Smartphone',
    description: 'Flutter, React Native, Swift & iOS/Android',
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    file: 'ui-ux-design.jpg',
    color: '#8B5CF6',
    icon: 'Figma',
    description: 'Figma, Motion Design, Prototyping & Systems',
  },
  {
    name: 'AI & Data Science',
    slug: 'ai-data-science',
    file: 'ai-data-science.jpg',
    color: '#3B82F6',
    icon: 'Brain',
    description: 'Python, ML Models, OpenAI API & LLM Agents',
  },
  {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    file: 'digital-marketing.jpg',
    color: '#F97316',
    icon: 'TrendingUp',
    description: 'SEO, Google Ads, Meta Ads & Content Strategy',
  },
  {
    name: 'Cyber Security & Cloud',
    slug: 'cyber-security-cloud',
    file: 'cyber-security-cloud.jpg',
    color: '#14B8A6',
    icon: 'ShieldCheck',
    description: 'AWS, Azure, Ethical Hacking & DevOps CI/CD',
  },
];

async function uploadToBunny(fileBuffer, targetPath, mimeType = 'image/jpeg') {
  const uploadUrl = `https://storage.bunnycdn.com/${bunnyStorageZone}/${targetPath}`;
  
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      AccessKey: bunnyStorageApiKey,
      'Content-Type': mimeType,
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    throw new Error(`Bunny upload HTTP ${res.status}: ${res.statusText}`);
  }

  return `${bunnyCdnHost}/${targetPath}`;
}

async function runUploadAndSeed() {
  console.log('🚀 Pushing local category images to Bunny Storage...');

  const uploadedCategories = [];

  for (const catDef of categoryDefinitions) {
    const filePath = path.join(localCategoryDir, catDef.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: Local file not found: ${filePath}`);
      continue;
    }

    console.log(`Reading ${catDef.file}...`);
    const fileBuffer = fs.readFileSync(filePath);
    const bunnyPath = `categories/${catDef.file}`;

    console.log(`Uploading ${catDef.file} to Bunny Storage (${bunnyPath})...`);
    const cdnUrl = await uploadToBunny(fileBuffer, bunnyPath);
    console.log(`✅ Uploaded to Bunny CDN: ${cdnUrl}`);

    uploadedCategories.push({
      name: catDef.name,
      slug: catDef.slug,
      icon: catDef.icon,
      color: catDef.color,
      coverImage: cdnUrl,
      description: catDef.description,
      isActive: true,
    });
  }

  console.log('\n📦 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('CONNECTED to MongoDB!');

  for (const catData of uploadedCategories) {
    await CategoryModel.findOneAndUpdate(
      { slug: catData.slug },
      catData,
      { upsert: true, new: true }
    );
    console.log(`Updated database category document: "${catData.name}" -> ${catData.coverImage}`);
  }

  console.log('\n🎉 SUCCESS! All category images pushed to Bunny CDN & MongoDB updated!');
  await mongoose.disconnect();
  process.exit(0);
}

runUploadAndSeed();
