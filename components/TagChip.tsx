import { AppColors, getTagColor } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface TagChipProps {
    label: string;
    index?: number;
    selected?: boolean;
    onPress?: () => void;
    size?: 'small' | 'medium';
}

export function TagChip({ label, index = 0, selected, onPress, size = 'medium' }: TagChipProps) {
    const primary = useThemeColor({}, 'primary');
    const bgColor = selected ? primary : getTagColor(index);
    const isSmall = size === 'small';

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? bgColor : bgColor + '20',
                    borderColor: bgColor,
                    paddingHorizontal: isSmall ? 8 : 12,
                    paddingVertical: isSmall ? 4 : 6,
                },
            ]}
        >
            <Text
                style={[
                    styles.label,
                    {
                        color: selected ? AppColors.white : bgColor,
                        fontSize: isSmall ? 11 : 13,
                        fontWeight: selected ? '700' : '600',
                    },
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        borderRadius: 20,
        borderWidth: 1.5,
        marginRight: 6,
        marginBottom: 6,
    },
    label: {
        textTransform: 'capitalize',
    },
});
