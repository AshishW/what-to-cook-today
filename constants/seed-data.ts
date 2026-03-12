import { Category } from '@/types/types';

export interface OnboardingMeal {
  title: string;
  description: string;
  tags: string[];
  categories: Category[];
}

export const ONBOARDING_MEALS: OnboardingMeal[] = [
  {
    title: 'Maggi',
    description: 'Quick and easy instant noodles with vegetables and spices. A beloved Indian comfort snack ready in minutes.',
    tags: ['instant', 'noodles', 'quick', 'spicy'],
    categories: ['Snack'],
  },
  {
    title: 'Fried Rice',
    description: 'Stir-fried rice with mixed vegetables, soy sauce, and scrambled eggs. A perfect way to use leftover rice.',
    tags: ['rice', 'vegetables', 'quick', 'stir-fry'],
    categories: ['Lunch', 'Dinner'],
  },
  {
    title: 'Dal Chawal',
    description: 'Comforting lentil curry served with steamed basmati rice. A staple everyday Indian meal.',
    tags: ['dal', 'rice', 'comfort', 'lentils', 'homestyle'],
    categories: ['Lunch', 'Dinner'],
  },
  {
    title: 'Sandwich',
    description: 'Toasted or fresh bread with vegetables, cheese, and chutneys. Quick, versatile, and satisfying.',
    tags: ['bread', 'vegetables', 'quick', 'cheese'],
    categories: ['Breakfast', 'Snack'],
  },
  {
    title: 'Pasta',
    description: 'Penne or spaghetti in a rich tomato or white sauce with herbs and vegetables.',
    tags: ['pasta', 'italian', 'quick', 'tomato sauce'],
    categories: ['Lunch', 'Dinner'],
  },
  {
    title: 'Paneer Curry',
    description: 'Soft paneer cubes in a spiced onion-tomato gravy. A rich and flavorful Indian classic.',
    tags: ['paneer', 'curry', 'spicy', 'gravy'],
    categories: ['Lunch', 'Dinner'],
  },
  {
    title: 'Salad',
    description: 'Fresh mixed greens with seasonal vegetables, nuts, and a light dressing. Healthy and refreshing.',
    tags: ['vegetables', 'healthy', 'fresh', 'light'],
    categories: ['Lunch'],
  },
  {
    title: 'Roti Sabzi',
    description: 'Freshly made whole wheat flatbread served with a seasonal vegetable dish. The everyday Indian meal.',
    tags: ['roti', 'vegetables', 'homestyle', 'everyday'],
    categories: ['Lunch', 'Dinner'],
  },
];
