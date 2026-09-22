# CivicDex Deployment Guide

This document outlines the steps taken to deploy CivicDex to Firebase and Google Cloud.

## Automated Deployment Summary

* **Firebase Hosting**: Deployed successfully.
  * URL: [https://community-hero-32b28.web.app](https://community-hero-32b28.web.app)
  * Includes a landing page and APK download link.
* **Firestore**: Rules and Indexes deployed.
  * Rules allow authenticated access for the hackathon.
* **Firebase Authentication**: Verified and active.
* **Android APK/AAB**: Generated successfully using a generated release keystore.
  * APK hosted as `civicdex.zip` on Firebase Hosting (Spark plan restriction bypass).

## Prerequisites

1.  **Firebase CLI**: Installed and authenticated (`firebase login`).
2.  **Node.js**: Required for Cloud Functions and Hosting.
3.  **Android SDK & Gradle**: Required for building the APK/AAB.

## Deployment Commands

### 1. Build Android Artifacts
```bash
./gradlew :app:assembleRelease :app:bundleRelease
```
Artifacts are located at:
* APK: `app/build/outputs/apk/release/app-release.apk`
* AAB: `app/build/outputs/bundle/release/app-release.aab`

### 2. Prepare Hosting
Copy the APK to the public folder (renaming to .zip for Spark plan compatibility):
```bash
cp app/build/outputs/apk/release/app-release.apk public/civicdex.zip
```

### 3. Deploy to Firebase
```bash
firebase deploy
```
*Note: Functions deployment requires the Firebase Blaze plan.*

## Manual Verification Steps
1.  Visit [https://community-hero-32b28.web.app](https://community-hero-32b28.web.app).
2.  Click "Download Release APK".
3.  Install the APK on an Android device.
4.  Verify that Gemini-powered features work (ensure `GEMINI_API_KEY` is set in the Firebase environment or handled via Secrets).
