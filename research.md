# Codebase Research Report: What-to-Cook App

## Project Overview
**What-to-Cook** is a modern, personal food journal and menu planner built with Expo and React Native. It allows users to document their meals, categorize them, and search through them based on ingredients (tags). The app emphasizes a "sleek" aesthetic with warm, food-oriented tones (oranges/reds) and avoids purple/violet.

## Tech Stack
- **Framework:** Expo SDK 54 (React Native 0.81, React 19)
- **Navigation:** `expo-router` (file-based routing)
- **Database:** `expo-sqlite` for structured recipe data
- **State Management:** React Context API (`store/data-store.tsx`)
- **Animation & Gestures:** `react-native-reanimated` and `react-native-gesture-handler`
- **File System:** `expo-file-system/next` (using modern `File` and `Directory` classes)
- **Utilities:** `jszip` for backup/restore, `expo-image` for high-performance image rendering, `expo-image-picker` for media capture.

---

## Technical Deep Dive

### 1. Database Architecture (`expo-sqlite`)
The application uses a local SQLite database named `whattocook.db`. State is managed via a single table, `recipes`, which stores both metadata and structural data.

#### Schema Definition:
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `TEXT` | Primary Key (UUID generated via `expo-crypto`) |
| `title` | `TEXT` | Dish name |
| `description` | `TEXT` | Preparation notes or recipe details |
| `imageUri` | `TEXT` | File URI to the permanent local storage |
| `tags` | `TEXT` | JSON-serialized array of strings (ingredients) |
| `category` | `TEXT` | JSON-serialized array of strings (e.g., ['Lunch', 'Dinner']) |
| `createdAt` | `TEXT` | ISO 8601 Timestamp |

**Implementation Detail:** Array-like data (`tags` and `categories`) are serialized/deserialized using `JSON.stringify` and `JSON.parse` during DB transactions. The `loadFromDB` function includes migration logic to handle legacy data formats (e.g., converting a single category string to a JSON array).

### 2. State Management & Data Flow
The app employs a **React Context-based store** (`DataProvider`) which serves as the "source of truth."

- **Initialization:** On mount, `initDB()` ensures the table exists. `loadData()` then reads from SQLite and populates the `items` state.
- **Optimistic Updates:** While primarily relying on sequential async calls, the store triggers a full `loadFromDB()` re-fetch after every CRUD operation to ensure UI synchronization.
- **Hooks-based Access:** Components use the `useData()` hook to access items and methods like `addItem`, `updateItem`, and `deleteItem`.
- **Filtering Logic:** Search and category filtering are performed in-memory on the `items` array using `useMemo` for performance, rather than complex SQL queries, which is efficient for typical personal-scale datasets.

### 3. File System & Image Lifecycle (`expo-file-system/next`)
The app utilizes the modern `expo-file-system/next` API, which provides a synchronous-feeling interface via `File` and `Directory` classes.

- **Capture to Cache:** `ImageUploader` uses `expo-image-picker` to save temporary files to the app's cache.
- **Permanent Promotion:** Upon saving a recipe, `saveImagePermanently()` (in `constants/file-system.ts`) copies the file from `cache` to the `documents/images` directory.
- **Naming Strategy:** Files are renamed to `${Date.now()}-${randomString}.ext` to prevent collisions.
- **Automatic Cleanup:** The `updateItem` and `deleteItem` methods explicitly call `deleteImageFile()` to remove unreferenced images from the disk, preventing "storage bloat."

### 4. Backup & Restore (ZIP-based Portability)
The import/export system is a complex pipeline involving data serialization and URI re-mapping.

#### Export Pipeline:
1. **Serialization:** SQLite data is fetched and converted to a `data.json` blob.
2. **URI Mapping:** Local `file://` paths are converted to relative filenames within the ZIP (e.g., `images/img_123.jpg`).
3. **Archiving:** `jszip` gathers the `data.json` and all binary images from the `documents/images` folder.
4. **Base64 Transfer:** Since `jszip` generates a blob/base64, the app uses `FileSystem.writeAsStringAsync` with `encoding: 'base64'` to save the final ZIP to the cache before sharing via `expo-sharing`.

#### Import Pipeline:
1. **Extraction:** The user selects a `.zip` via `DocumentPicker`.
2. **Hydration:** The app unzips the archive, moves images back into the `documents/images` folder, and re-maps the relative paths in `data.json` back to absolute local URIs.
3. **DB Merge:** Data is inserted into SQLite using a `BEGIN TRANSACTION / COMMIT` block to ensure atomicity.

### 5. Internationalization & Theming
- **i18n Utility:** A custom dictionary in `constants/i18n.ts` supports five languages. The `t()` function handles lookups based on the `language` state stored in `AsyncStorage`.
- **Dynamic Theming:** The `AppColors` constant provides standard and dark-mode variants. `use-theme-color.ts` dynamically selects colors based on the current `themeMode` (light/dark).
- **No-Purple Constraint:** The color palette is strictly locked to `primary: #E64A19` (Orange) and earthy tones to maintain the requested food-app aesthetic.

### 6. Component Architecture
- **Navigation Coupling:** `expo-router` is used for deep linking. For example, `item-form` can accept a `category` param to pre-fill the form when adding from a specific section on the Feed.
- **Gesture Support:** `SwipeableCardStack` and `CategorySection` leverage `react-native-gesture-handler` for smooth, native-feeling interactions.
- **Separation of Concerns:** `FoodCard` is a pure presentational component used across both the Feed (carousel) and Search (grid) screens.
