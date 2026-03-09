# Implementation Plan for What-to-Cook App

## Overview
This plan outlines the required modifications based on the `ui_docs.md` specifications. We will refactor the UI/UX, transition the data storage from `AsyncStorage` to `expo-sqlite`, improve the files export/import logic, and apply an overall generic modern food app design excluding any purple/violet tones.

## 1. Project Setup and Dependencies
- Install required dependencies for SQLite, ZIP file handling, and document picking:
```bash
npx expo install expo-sqlite react-native-zip-archive expo-document-picker
```
- Update existing imports of `expo-file-system` to use the new `File` and `Directory` classes APIs.

## 2. Global Styling and Theming
- Change color palette to warm, earthy food tones (e.g., oranges, greens, reds, warm grays) avoiding purples/violets.
- Configure global text styles and React Navigation theme colors.
- Define shared constant colors in `constants/Colors.ts`.

## 3. Data Storage Migration (SQLite)
- Replace `AsyncStorage` usage in `store/data-store.tsx` with `expo-sqlite`.
- Create tables for `recipes` and `tags`.
- Expose methods: `addRecipe`, `updateRecipe`, `deleteRecipe`, `getRecipes`, `searchRecipesByTags`.

## 4. UI Adjustments
### 4.1. Feed Screen (`app/(tabs)/index.tsx` or similar)
- Refactor the swipeable card stack: Remove game-card look, implement horizontal scroll view with smooth animations.
- Implement the "Categories Carousel" like Hotstar/Netflix below the main stack.
- Promote FAB to top right.

### 4.2. Item Detail Screen (`app/item-detail.tsx`)
- Full-width header image.
- Bold title, description, and list of tags.
- Action buttons (Edit/Delete) side-by-side at the bottom.

### 4.3. Add / Edit Item Form (`app/item-form.tsx`)
- Add a dashed drop-zone area for images.
- Input fields for Title and Description.
- Dynamic input field for adding vegetarian ingredient tags.

### 4.4. Search Screen (`app/(tabs)/search.tsx`)
- Implement a search bar at the top.
- Create a category-driven filter using ingredient chips (populated from DB distinct tags).
- **Recent Enhancement:** Tags within the search screen are filtered dynamically based on the search query.
- **Persistence:** Selected tags remain visible even when the search query changes or doesn't match the selected tag.
- Map search results to grid/list clickable thumbnails.

### 4.5. Settings and Import/Export logic (`app/(tabs)/settings.tsx`)
- Display UI settings (Theme preference, Language toggles).
- **Export Workflow:**
  1. Serialize SQLite data to `data.json` and save to a temporary file via:
     ```javascript
     import { File, Paths } from 'expo-file-system/next';
     const file = new File(Paths.cache, 'data.json');
     file.write(JSON.stringify(exportData));
     ```
  2. Zip `data.json` and images directory via `react-native-zip-archive`.
  3. Share `export.zip` via `expo-sharing`.
- **Import Workflow:**
  1. Pick `.zip` file via `expo-document-picker`.
  2. Unzip using `react-native-zip-archive`.
  3. Read `data.json`, update SQLite. Move unzipped images to app's Document directory using new filesystem move/copy methods.

## Todo List
- [x] Install missing dependencies (`expo-sqlite`, `react-native-zip-archive` etc)
- [x] Define generic app color palette (no purple/violet)
- [x] Migrate `data-store.tsx` to `expo-sqlite`
- [x] Implement Settings Screen Import, Export, Share using new FS API
- [x] Refactor Feed Screen (Swipeable Cards, Category Carousel, Top-right FAB)
- [x] Refactor Item Detail Screen (Full-width header)
- [x] Refactor Add/Edit Form (Dashed drop zone, tag inputs)
- [x] Refactor Search Screen (Search bar, dynamic tag chips, results grid)
- [x] Fix zipFolder error by replacing react-native-zip-archive with jszip
- [x] Change primary color to orange/reddish (food app vibes)
- [x] Add Camera support for ImageUploader and disable problematic crop page
- [x] Implement dynamic tag filtering on Search screen (filter tags by query, keep selected tags visible)
- [ ] General testing & cleanup
