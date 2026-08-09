import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const bunnyStorageApiKey = '549dd8a8-06e1-4f61-99849942ab86-ca44-4d3c';
const bunnyStorageZone = 'class-connect';
const bunnyCdnHost = 'https://class-connect.b-cdn.net';
const mongoUri = 'mongodb://mainhunloki:Sam4Code00@ac-avpidra-shard-00-00.7xcxlt8.mongodb.net:27017,ac-avpidra-shard-00-01.7xcxlt8.mongodb.net:27017,ac-avpidra-shard-00-02.7xcxlt8.mongodb.net:27017/class-connect?ssl=true&authSource=admin';

const contentBlockSchema = new Schema(
  {
    page: { type: String, required: true },
    section: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    data: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ContentBlockModel = mongoose.models.ContentBlock || model('ContentBlock', contentBlockSchema);

async function main() {
  console.log('🔄 Uploading Hero Desktop & Mobile images to Bunny Storage...');

  const desktopLocalPath = path.resolve(process.cwd(), '../client/public/assets/hero_students_hq.jpg');
  const mobileLocalPath = path.resolve(process.cwd(), '../client/public/assets/about_hero_lead.jpg');

  let desktopCdnUrl = `${bunnyCdnHost}/cms/hero_desktop.jpg`;
  let mobileCdnUrl = `${bunnyCdnHost}/cms/hero_mobile.jpg`;

  if (fs.existsSync(desktopLocalPath)) {
    const desktopBuffer = fs.readFileSync(desktopLocalPath);
    const desktopTargetUrl = `https://storage.bunnycdn.com/${bunnyStorageZone}/cms/hero_desktop.jpg`;
    const res = await fetch(desktopTargetUrl, {
      method: 'PUT',
      headers: {
        AccessKey: bunnyStorageApiKey,
        'Content-Type': 'image/jpeg',
      },
      body: desktopBuffer,
    });
    if (res.ok) {
      console.log('✅ Uploaded Desktop Hero Image:', desktopCdnUrl);
    } else {
      console.error('❌ Failed Desktop upload:', res.status, res.statusText);
    }
  }

  if (fs.existsSync(mobileLocalPath)) {
    const mobileBuffer = fs.readFileSync(mobileLocalPath);
    const mobileTargetUrl = `https://storage.bunnycdn.com/${bunnyStorageZone}/cms/hero_mobile.jpg`;
    const res = await fetch(mobileTargetUrl, {
      method: 'PUT',
      headers: {
        AccessKey: bunnyStorageApiKey,
        'Content-Type': 'image/jpeg',
      },
      body: mobileBuffer,
    });
    if (res.ok) {
      console.log('✅ Uploaded Mobile Hero Image:', mobileCdnUrl);
    } else {
      console.error('❌ Failed Mobile upload:', res.status, res.statusText);
    }
  }

  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);

  const heroBlock = await ContentBlockModel.findOne({ section: 'hero' });
  if (heroBlock) {
    const currentData = heroBlock.data || {};
    heroBlock.data = {
      ...currentData,
      imageUrl: desktopCdnUrl,
      desktopImageUrl: desktopCdnUrl,
      mobileImageUrl: mobileCdnUrl,
    };
    heroBlock.markModified('data');
    await heroBlock.save();
    console.log('✅ Updated MongoDB hero content block with desktop & mobile URLs!');
  } else {
    console.log('⚠️ Hero block not found in MongoDB!');
  }

  await mongoose.disconnect();
  console.log('🎉 Done!');
}

main().catch(err => {
  console.error('Script Error:', err);
  process.exit(1);
});
