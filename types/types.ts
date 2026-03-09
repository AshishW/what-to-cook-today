export interface FoodItem {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  tags: string[];
  categories: Category[];
  createdAt: string;
}

export type Category = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export const CATEGORIES: Category[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export type LanguageCode = 'en' | 'hi' | 'mr' | 'fr' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
];
