// Main build script for creating APK/AAB using Bubblewrap
import fs from 'fs-extra';
import { execSync } from 'child_process';
import path from 'path';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  appName: 'Brimind Chat',
  packageId: 'ai.brimind.pro',
  webUrl: 'https://ai.btimind.pro',
  iconPath: './assets/icon.png',
  outputDir: './brimind-twa',
  buildType: 'apk', // 'apk' or 'aab'
  manifestUrl: 'https://ai.btimind.pro/manifest.json',
  startUrl: 'https://ai.btimind.pro',
  themeColor: '#1976d2',
  backgroundColor: '#ffffff',
  displayMode: 'standalone',
  orientation: 'portrait'
};

async function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  try {
    execSync('java -version', { stdio: 'ignore' });
    console.log('✅ Java found');
  } catch (error) {
    console.error('❌ Java not found. Please install Java JDK 8 or higher');
    process.exit(1);
  }
  
  try {
    execSync('which android || which sdkmanager', { stdio: 'ignore' });
    console.log('✅ Android SDK found');
  } catch (error) {
    console.log('⚠️  Android SDK not found. Will attempt to download automatically');
  }
}

async function createManifestIfNotExists() {
  console.log('📝 Creating web manifest...');
  
  const manifest = {
    name: config.appName,
    short_name: 'Brimind',
    start_url: config.startUrl,
    display: config.displayMode,
    orientation: config.orientation,
    theme_color: config.themeColor,
    background_color: config.backgroundColor,
    icons: [
      {
        src: 'icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
  
  await fs.ensureDir('./assets');
  await fs.writeFile('./assets/manifest.json', JSON.stringify(manifest, null, 2));
  console.log('✅ Manifest created at ./assets/manifest.json');
}

async function initializeBubblewrap() {
  console.log('🫧 Initializing Bubblewrap project...');
  
  // Clean up existing directory
  if (await fs.pathExists(config.outputDir)) {
    await fs.remove(config.outputDir);
  }
  
  try {
    // Try to use remote manifest first
    execSync(`bubblewrap init --manifest ${config.manifestUrl}`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.log('🔄 Remote manifest not found, using local manifest...');
    await createManifestIfNotExists();
    
    execSync(`bubblewrap init --manifest ./assets/manifest.json`, {
      stdio: 'inherit'
    });
  }
  
  console.log('✅ Bubblewrap project initialized');
}

async function configureTwaManifest() {
  console.log('⚙️ Configuring TWA manifest...');
  
  const twaManifestPath = './twa-manifest.json';
  
  if (await fs.pathExists(twaManifestPath)) {
    const twaManifest = await fs.readJson(twaManifestPath);
    
    // Update configuration
    twaManifest.packageId = config.packageId;
    twaManifest.name = config.appName;
    twaManifest.launcherName = config.appName;
    twaManifest.host = 'ai.btimind.pro';
    twaManifest.startUrl = config.startUrl;
    twaManifest.themeColor = config.themeColor;
    twaManifest.backgroundColor = config.backgroundColor;
    twaManifest.enableNotifications = true;
    twaManifest.signingKey = {
      path: './android.keystore',
      alias: 'android'
    };
    
    await fs.writeFile(twaManifestPath, JSON.stringify(twaManifest, null, 2));
    console.log('✅ TWA manifest configured');
  }
}

async function buildApp() {
  console.log(`🔨 Building ${config.buildType.toUpperCase()}...`);
  
  try {
    if (config.buildType === 'aab') {
      execSync('bubblewrap build --skipSigning', { stdio: 'inherit' });
    } else {
      execSync('bubblewrap build', { stdio: 'inherit' });
    }
    
    console.log(`✅ ${config.buildType.toUpperCase()} build completed!`);
    console.log(`📱 Output files can be found in: ./app/build/outputs/`);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    console.log('🚀 Starting Brimind Chat App Builder...');
    console.log(`📱 App: ${config.appName}`);
    console.log(`🌐 URL: ${config.webUrl}`);
    console.log(`📦 Package: ${config.packageId}`);
    
    await checkPrerequisites();
    await initializeBubblewrap();
    await configureTwaManifest();
    await buildApp();
    
    console.log('🎉 Build process completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, config };