# What-to-Cook

**What-to-Cook** is a sleek, modern personal food journal and menu planner built with Expo and React Native. Designed for food enthusiasts and home cooks, it allows you to document your culinary creations, categorize them, and quickly find inspiration for your next meal.

![App Icon](assets/images/icon.png)

## ✨ Features

- **Personal Food Journal:** Capture your meals with photos and detailed notes.
- **Swipeable Discovery:** Browse your dishes using a smooth, native-feeling swipe interface.
- **Smart Filtering:** Categorize meals (Breakfast, Lunch, Dinner, etc.) and filter by ingredients using a dynamic tag system.
- **Dark Mode Support:** Full high-contrast dark theme that maintains a warm, food-app aesthetic.
- **Localized:** Available in English, Hindi, Marathi, French, and Spanish.
- **Local-First & Secure:** All data is stored locally on your device using SQLite.
- **Backup & Restore:** Seamlessly export and import your entire collection as a portable ZIP archive.

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev) SDK 54 / React Native
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based)
- **Database:** `expo-sqlite`
- **State Management:** React Context API
- **Animations:** `react-native-reanimated` & `react-native-gesture-handler`
- **File System:** `expo-file-system/next`
- **Images:** `expo-image` for high-performance rendering

## 🏗️ Architecture Overview

### Database
The app uses a local SQLite database (`whattocook.db`) with a robust schema to store recipe metadata, JSON-serialized categories, and ingredient tags.

### Image Management
Utilizes the modern `expo-file-system/next` API for efficient image lifecycle management. Images are captured to a cache and "promoted" to permanent storage upon saving, with automatic cleanup of unreferenced files to prevent storage bloat.

### Portability
The backup system leverages `jszip` to create a self-contained archive containing both the SQLite data (as JSON) and all referenced image binaries, with automated URI re-mapping on import.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) on your mobile device or an emulator (Android Studio / Xcode)

### 2. Installation
```bash
npm install
```

### 3. Running the App
```bash
npx expo start
```
Scan the QR code with your Expo Go app or press `a` for Android / `i` for iOS to start the bundler.

## 🎨 Design Principles
- **Aesthetic:** Warm, earthy tones (Oranges/Reds) to evoke appetite and comfort.
- **Constraint:** Strictly avoids purple/violet tones to maintain branding consistency.
- **Typography:** Modern, legible sans-serif fonts with support for multiple scripts.

---
Built with ❤️ for home cooks everywhere.
