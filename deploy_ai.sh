#!/bin/bash

echo "🚀 Deploying CivicDex AI Infrastructure..."

# 1. Build Android App
echo "📦 Building Android Release APK..."
./gradlew assembleRelease

# 2. Deploy Cloud Functions
echo "🔥 Deploying Firebase Cloud Functions..."
cd functions
npm install
npm run build
firebase deploy --only functions

# 3. Deploy Firestore Rules (including AI triggers)
echo "📄 Deploying Firestore Rules..."
cd ..
firebase deploy --only firestore:rules

echo "✅ Deployment Complete!"
echo "CivicDex AI is now active across Android and Google Cloud."
