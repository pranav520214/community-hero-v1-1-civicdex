# Google Cloud & Firebase Production Deployment

Detailed production deployment steps for CivicDex.

## Architecture
*   **Frontend**: Native Android (Kotlin/Compose).
*   **Backend**: Firebase Cloud Functions (Node.js).
*   **Database**: Cloud Firestore.
*   **Storage**: Cloud Storage for Firebase.
*   **Hosting**: Firebase Hosting for the download landing page.
*   **AI**: Google Gemini API via Firebase AI (Vertex AI for Firebase).

## Step-by-Step Production Deployment

### 1. Project Initialization
```bash
# Set your project ID
export PROJECT_ID=community-hero-32b28
gcloud config set project $PROJECT_ID
```

### 2. Enable APIs
Enable required Google Cloud APIs:
```bash
gcloud services enable \
    cloudfunctions.googleapis.com \
    cloudbuild.googleapis.com \
    firestore.googleapis.com \
    firebasestorage.googleapis.com \
    artifactregistry.googleapis.com
```

### 3. Deploy Backend (Functions)
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### 4. Deploy Infrastructure (Firestore & Storage)
```bash
firebase deploy --only firestore,storage
```

### 5. Deploy Landing Page
```bash
firebase deploy --only hosting
```

## Security & Performance
*   **App Check**: Enabled to protect backend resources.
*   **Rules**: Production-ready Firestore and Storage rules are located in the root directory.
*   **Monitoring**: Crashlytics and Analytics are integrated into the Android app.
