# Firebase Setup

To connect the application to Firebase, follow these steps:

1.  **Create a Firebase Project**:
    *   Go to [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the setup.

2.  **Create a Firestore Database**:
    *   In your project dashboard, go to "Build" > "Firestore Database".
    *   Click "Create database".
    *   Start in **Test mode** (for development) or **Production mode** (you will need to configure rules).
    *   Choose a location.

3.  **Update Security Rules** (Critical for Seeding):
    *   Go to the "Rules" tab in Firestore.
    *   Change the rules to allow read/write for now (or configure properly):
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
    ```
    *   Click "Publish".

4.  **Enable Firebase Storage** (Required for Image Uploads):
    *   In the Firebase Console, go to **Storage** (in the left sidebar under "Build").
    *   Click **Get Started**.
    *   Start in **Test mode** for development (or configure proper rules).
    *   Choose the same location as your Firestore database.
    *   Click **Done**.
    *   Go to the **Rules** tab and update to allow writes:
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read: if true;
          allow write: if true; // Allow for now, secure later with admin auth
        }
      }
    }
    ```
    *   Click **Publish**.

5.  **Get Configuration**:
    *   Go to Project Settings (gear icon > Project settings).
    *   Scroll down to "Your apps".
    *   Click the Web icon (`</>`) to create a web app.
    *   Register the app (you don't need Firebase Hosting yet).
    *   Copy the `firebaseConfig` object values.

6.  **Configure Environment Variables**:
    *   Create a file named `.env.local` in the root of your project.
    *   Add the following content, replacing the values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

7.  **Restart the Server**:
    *   Stop the running server (Ctrl+C).
    *   Run `npm run dev` again.

## Data Migration
The application is configured to automatically upload your local `data.json` to Firestore if the database is empty upon the first write operation or you can trigger it manually.

## Image Uploads
Images are now stored in Firebase Storage instead of the local file system, which ensures they persist after deployment to serverless platforms like Vercel.
