This document outlines the UI/UX specifications for the **What-to-cook App**, a personal food journal and menu planner. The design focuses on a "sleek" aesthetic, deliberately avoiding purple or violet tones. when implementing the following things; make sure  you read the https://docs.expo.dev/ documentation for syntax and other required things. 

---

## 1. Design Overview

* **Theme:** Modern, clean, and minimalist.
* **Color Palette:** typical colors used or food apps.
* **Navigation:** A persistent bottom navigation bar containing icons for **Feed**, **Search**, and **Settings**, with a prominent Floating Action Button (FAB) for adding new items.

---

## 2. Screen Specifications

### 2.1 Feed Screen (Home)

The entry point of the application, designed for quick browsing and discovery.

* **Swipeable Card Stack:** A deck of "What’s Cooking Today" cards featuring high-quality food images with titles overlapped at the bottom. These cards support animated swiping gestures.The cards should be scrollable sideways with animation. These should be shown randomly selected from the existing user data.
note: the current cards look like game cards which is not expected result so modify that look.
* **Categories Carousel:** A horizontal scrolling list of meal types (e.g., Breakfast, Lunch, Dinner, Snack) located below the main stack. so this should look more like OTT apps like hotstar or netflix where we have a category name and carousel of cards below it for each category.
* **Add Item FAB:** A "+" button in the Top right corner ( + inside circle) that opens the Create/Update screen.

### 2.2 Item Detail Screen

Triggered by clicking a card from the Feed or Search results.

* **Visuals:** Full-width header image of the dish.
* **Content:**
* **Title:** Bold header (e.g., "Lentils and Vegetable Stew").
* **Description:** A text block for the recipe or notes.
* **Tags:** Display of vegetarian ingredient tags (e.g., lentils, carrots, spinach, vegan).


* **Actions:** "Edit" and "Delete" buttons placed side-by-side at the bottom of the content area.

### 2.3 Add / Edit Item (CRUD)

The interface for creating or modifying entries.

* **Image Upload:** A dashed drop-zone area labeled "(Upload/Replace)" for adding dish photos.
* **Input Fields:** Text inputs for "Title" and "Description".
* **Tags Input:** A dynamic input field for adding vegetarian ingredients/tags (e.g., tomato, onions, basil).
* **Footer Actions:** "Save"  and "Cancel" buttons.

### 2.4 Search Screen

Dedicated to filtering and finding specific past meals.

* **Search Bar:** A top-mounted search field with a magnifying glass icon.
* **Filter by Tags (ingredients that user has in their kitchen):** A dense cloud of ingredient-based chips (e.g., Pasta, Tofu, Mushrooms) that users can toggle to refine results. These tags should come there from the existing user data. 
* **Search Results:** A grid or list of cards showing small thumbnails and titles (e.g., "Kale Salad", "Stuffed Potato") on click which opens respective page for that dish. 

### 2.5 Settings Screen

* **General Settings:** A list of application preferences like theme and language(options to change the whole apps text to different languages with list of different options) with chevron icons for sub-menus.
* **Data Management:**
* **Import Data:** Button to upload backup files. this should include images as well. The format of the export should be user friendly and shareble.
The Import Workflow:
- Select: The user picks the .zip file using a document picker (e.g., react-native-document-picker).
- Unzip: Use react-native-zip-archive to extract the contents into a temporary directory.
- Validate: Check if the data.json exists and is formatted correctly.
- Restore Images: Move images from the temp folder to the app's permanent Documents directory.

Merge Data: Update your local database (SQLite/WatermelonDB) with the new entries.
* **Export Data:** Button to save the local database/menu history. 
To implement this, you will follow a three-step pipeline:

- Serialize: Convert your app’s database (SQLite) into a data.json file.
- Archive: Collect all the food images from your app's internal storage and the data.json file into a .zip folder.

* **Share menu:** Button to share the exported data. Use the native system share sheet to let the user save or send the file.




---

## 3. Interaction Flow

1. **Create:** User taps **(+)** on Feed → Fills Create Form → Taps **Save**.
2. **View/Delete:** User clicks **Card** on Feed → Views Detail → Taps **Delete** → Confirms deletion.
3. **Search:** User taps **Search Icon** → Filters by **Tags**/what are available ingredients → Selects a result card.


NOTE: There is an error (method writeAsStringAsync imported from "expo-file-system" is deprecated.
You can migrate to the new filesystem API using "File" and "Directory" classes or import the legacy API from "expo-file-system/legacy".
API reference and examples are available in the filesystem docs: https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/
) your have refer the docs to fix it as well. 