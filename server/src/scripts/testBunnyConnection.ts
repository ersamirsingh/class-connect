import 'dotenv/config';
import { MediaService } from '../services/mediaService';

async function run() {
  console.log('🔍 Checking Bunny Stream & Bunny Storage connection status...\n');
  const status = await MediaService.checkBunnyConnections();
  
  console.log('🎥 Video Streaming (Bunny Stream):');
  console.log(`   Configured: ${status.stream.configured}`);
  console.log(`   Connected:  ${status.stream.connected}`);
  console.log(`   Status:     ${status.stream.statusText}\n`);

  console.log('🖼️ Photo / Image Storage (Bunny Storage):');
  console.log(`   Configured: ${status.storage.configured}`);
  console.log(`   Connected:  ${status.storage.connected}`);
  console.log(`   Status:     ${status.storage.statusText}\n`);
}

run().catch((err) => console.error('Error testing Bunny connections:', err));
