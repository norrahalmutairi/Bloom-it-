# BloomIt - React Native App Setup Guide

## Creating a New Expo Project

1. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

2. Create a new Expo project:
```bash
npx create-expo-app bloomit
cd bloomit
```

## Required Dependencies

Install the following dependencies:

```bash
npx expo install @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack expo-location expo-status-bar firebase@9.6.7 react-native-maps react-native-safe-area-context react-native-screens
```

Install development dependencies:

```bash
npm install --save-dev @babel/core @babel/plugin-proposal-object-rest-spread react-native-dotenv
```

## Files to Copy from Original Project

Copy the following files and directories from the original project to your new project:

1. All files in the `screens/` directory
2. `assets/` directory (contains images and resources)
3. The following JavaScript files:
   - `App.js` (main application file)
   - `AuthContext.js` (authentication context)
   - `firebase.js` (Firebase configuration)
   - `firebaseInit.js` (Firebase initialization)
   - `index.js` (entry point)
   - `metro.config.js` (Metro bundler configuration)
   - `babel.config.js` (Babel configuration)

## Firebase Configuration

1. Create a new Firebase project at https://console.firebase.google.com/
2. Set up Authentication with Email/Password
3. Update the `firebase.js` file with your own Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```


2. Update `app.json` with your API keys:
   ```json
   "ios": {
     "config": {
       "googleMapsApiKey": "YOUR_IOS_API_KEY_HERE"
     }
   },
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "YOUR_ANDROID_API_KEY_HERE"
       }
     }
   }
   ```

## Running the App

1. Start the Expo development server:
```bash
npx expo start
```

2. Use Expo Go app on your device to scan the QR code or run on emulator:
```bash
# For Android emulator
npx expo start --android

# For iOS simulator
npx expo start --ios
```

## Project Structure

The project follows this structure:
- `App.js`: Main app component with navigation setup
- `screens/`: Contains all screen components
  - `AuthStack.js`: Authentication navigation stack
  - `LoginScreen.js`: Login screen
  - `SignupScreen.js`: Registration screen
  - `WelcomeScreen.js`: Welcome screen
  - `ProfileScreenWithAuth.js`: Profile screen with authentication
- `firebase.js`: Firebase configuration and auth functions
- `AuthContext.js`: Context for managing authentication state
- `assets/`: App images and resources

## Notes

1. The app uses React Navigation v7 for navigation
2. Authentication is handled through Firebase Authentication
3. Maps functionality requires valid Google Maps API keys
4. The app uses Expo's managed workflow for easier development

## Troubleshooting

- If you encounter dependency conflicts, try using `npx expo install` instead of `npm install` as it ensures compatibility with Expo
- For Firebase issues, check that authentication is properly enabled in the Firebase console
- For map issues, verify your API keys and ensure the services are enabled in Google Cloud Console 