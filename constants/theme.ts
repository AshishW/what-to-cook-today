import { Platform } from 'react-native';

export const AppColors = {
  primary: '#E64A19',
  primaryLight: '#FF8A65',
  primaryDark: '#BF360C',

  background: '#F5F5F0',
  backgroundDark: '#1A1A2E',

  card: '#FFFFFF',
  cardDark: '#2D2D44',

  text: '#2D3436',
  textLight: '#636E72',
  textDark: '#ECEDEE',
  textMuted: '#B2BEC3',

  // Earthy tag colors
  tagSage: '#8DB580',
  tagCarrot: '#E67E22',
  tagCream: '#F5DEB3',
  tagTeal: '#FFA726',
  tagTomato: '#E74C3C',
  tagMustard: '#D4AC0D',

  border: '#DFE6E9',
  borderDark: '#3D3D5C',

  danger: '#E74C3C',
  dangerLight: '#FADBD8',

  white: '#FFFFFF',
  black: '#000000',

  tabBar: '#FAFAF5',
  tabBarDark: '#16162A',

  overlay: 'rgba(0,0,0,0.4)',
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
