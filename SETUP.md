# CivicDex Project Setup

Follow these steps to set up the project locally for development.

## 1. Environment Configuration
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

## 2. Android Studio
1.  Open the project in Android Studio.
2.  Wait for Gradle sync to complete. (Fixed AGP 9.2.1 and Gradle 9.4.1 are used).
3.  Ensure you are using JDK 17+ (Bundled JBR recommended).

## 3. Firebase Setup
1.  Initialize Firebase:
    ```bash
    firebase init
    ```
2.  Select Firestore, Functions, Hosting, and Storage.
3.  Use the existing configuration files:
    *   `firebase.json`
    *   `.firebaserc`
    *   `firestore.rules`
    *   `storage.rules`

## 4. Running the App
1.  Connect an Android device or start an emulator.
2.  Click **Run** in Android Studio.
