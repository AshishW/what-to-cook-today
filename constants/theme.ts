import { Platform } from 'react-native';

export const AppColors = {
  primary: '#E64A19',
  primaryLight: '#FF8A65',
  primaryDark: '#BF360C',

  background: '#F5F5F0',
  backgroundDark: '#121212',

  card: '#FFFFFF',
  cardDark: '#1E1E1E',

  text: '#2D3436',
  textLight: '#636E72',
  textDark: '#ECEDEE',
  textMuted: '#B2BEC3',

  border: '#DFE6E9',
  borderDark: '#2C2C2C',

  danger: '#E74C3C',
  dangerLight: '#FADBD8',

  white: '#FFFFFF',
  black: '#000000',

  tabBar: '#FAFAF5',
  tabBarDark: '#161616',

  overlay: 'rgba(0,0,0,0.4)',

  // Earthy tag colors
  tagSage: '#8DB580',
  tagCarrot: '#E67E22',
  tagCream: '#F5DEB3',
  tagTeal: '#FFA726',
  tagTomato: '#E74C3C',
  tagMustard: '#D4AC0D',
};

export const Colors = {
  light: {
    text: AppColors.text,
    background: AppColors.background,
    tint: AppColors.primary,
    icon: AppColors.textLight,
    tabIconDefault: AppColors.textMuted,
    tabIconSelected: AppColors.primary,
    card: AppColors.card,
    border: AppColors.border,
    primary: AppColors.primary,
  },
  dark: {
    text: AppColors.textDark,
    background: AppColors.backgroundDark,
    tint: AppColors.primaryLight,
    icon: AppColors.textMuted,
    tabIconDefault: AppColors.textMuted,
    tabIconSelected: AppColors.primaryLight,
    card: AppColors.cardDark,
    border: AppColors.borderDark,
    primary: AppColors.primary,
  },
};

export const TAG_COLORS = [
  AppColors.tagSage,
  AppColors.tagCarrot,
  AppColors.tagCream,
  AppColors.tagTeal,
  AppColors.tagTomato,
  AppColors.tagMustard,
];

export const getTagColor = (index: number): string => {
  return TAG_COLORS[index % TAG_COLORS.length];
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
