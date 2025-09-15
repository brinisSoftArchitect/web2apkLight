# Brimind Chat App Builder

## Overview
This project builds an Android APK/AAB for Brimind Chat using Bubblewrap (Trusted Web Activity).

## Prerequisites
- Node.js (v14 or higher)
- Java JDK 8 or higher
- Android SDK (will be downloaded automatically if not found)

## Configuration
- **App Name**: Brimind Chat
- **Package ID**: ai.brimind.pro
- **Web URL**: https://ai.btimind.pro
- **Build Type**: APK (configurable to AAB)

## Quick Start
```bash
# Install dependencies
npm install

# Build the app (APK)
npm run build

# Build AAB instead
npm run build-aab
```

## Manual Steps
```bash
# Initialize Bubblewrap project
npm run init

# Build APK
npm run build-apk

# Build AAB (for Play Store)
npm run build-aab
```

## Output
Built APK/AAB files will be located in:
- `./app/build/outputs/apk/release/`
- `./app/build/outputs/bundle/release/`

## Customization
Edit the configuration object in `build-app.js` to modify:
- App name and package ID
- Theme colors
- Icon paths
- Build type (APK vs AAB)

## Signing
For production builds, you'll need to:
1. Generate a signing keystore
2. Configure signing in the TWA manifest
3. Use the signed build for Play Store submission

## Troubleshooting
- Ensure Java and Android SDK are properly installed
- Check that the web manifest is accessible at the specified URL
- Verify the website meets PWA requirements for TWA compatibility