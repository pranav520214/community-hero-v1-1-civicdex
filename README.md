# CivicDex - Hyperlocal Community Platform

CivicDex is an AI-powered hyperlocal community platform that enables citizens to report, verify, track, and resolve local infrastructure issues.

## 🚀 Live Demo
*   **Landing Page & APK Download**: [https://community-hero-32b28.web.app](https://community-hero-32b28.web.app)

## 🤖 AI Features (Powered by Gemini 1.5 Flash/Pro)
CivicDex leverages state-of-the-art AI for:
*   **Vision Analysis**: Automated hazard detection, severity estimation, and title generation.
*   **Fraud Detection**: Identifies fake reports, screenshots, and internet-sourced images.
*   **Duplicate Detection**: Uses GPS and description embeddings to prevent repeat reports.
*   **Before/After Verification**: Validates worker repairs using visual comparison.
*   **Workforce AI**: Optimizes task assignment based on worker proximity and load.
*   **Officer Dashboard**: Generates daily executive briefings and critical hotspot alerts.
*   **Citizen Assistant**: A regional-language-enabled chatbot for 24/7 help.
*   **Region Mapping**: Integrates KNN-5 and 10km proximity datasets for localized analysis.

## 🛠️ Tech Stack
*   **Android**: Kotlin, Jetpack Compose, Room, Retrofit.
*   **Backend**: Firebase (Auth, Firestore, Storage, Functions).
*   **AI**: Google Gemini API.
*   **DevOps**: Firebase Hosting, GitHub Actions.

## 📖 Documentation
*   [SETUP.md](./SETUP.md) - Local development setup.
*   [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment summary.
*   [GOOGLE_CLOUD_DEPLOYMENT.md](./GOOGLE_CLOUD_DEPLOYMENT.md) - Detailed GCP guide.

## 🏗️ Building from Source
1.  Clone the repository.
2.  Set up `.env` with `GEMINI_API_KEY`.
3.  Open in Android Studio (AGP 9.2.1 / Gradle 9.4.1).
4.  Run `./gradlew assembleRelease` to generate the APK.

---
*Created for the Hackathon.*
