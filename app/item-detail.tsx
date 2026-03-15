import { TagChip } from "@/components/TagChip";
import { ThemedText } from "@/components/themed-text";
import { getCategoryTranslation, t } from "@/constants/i18n";
import { AppColors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useData } from "@/store/data-store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItemById, deleteItem, logExistingCook, language } = useData();
  const item = getItemById(id);

  const [isCookModalVisible, setIsCookModalVisible] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.notFound}>
          <ThemedText style={styles.notFoundText}>Item not found</ThemedText>
        </View>
      </View>
    );
  }

  const handleLogCookConfirm = async () => {
    setShowConfetti(true);
    await logExistingCook(item.id);

    setTimeout(() => {
      setShowConfetti(false);
      setIsCookModalVisible(false);
    }, 2500);
  };

  const handleDelete = () => {
    Alert.alert(
      t("deleteConfirmTitle", language),
      t("deleteConfirmMessage", language),
      [
        { text: t("cancel", language), style: "cancel" },
        {
          text: t("confirm", language),
          style: "destructive",
          onPress: async () => {
            await deleteItem(item.id);
            router.back();
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    router.push({ pathname: "/item-form", params: { id: item.id } });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView bounces={false}>
        {/* Header Image */}
        <View
          style={[styles.imageContainer, { backgroundColor: primary + "10" }]}
        >
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.headerImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="restaurant"
                size={60}
                color={AppColors.primaryLight}
              />
            </View>
          )}
          {/* Back button */}
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={AppColors.text} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor }]}>
          <ThemedText style={styles.title} type="title">
            {item.title}
          </ThemedText>

          <View style={styles.tagsContainer}>
            {item.categories.map((cat, index) => (
              <View
                key={cat}
                style={[
                  styles.categoryBadge,
                  { backgroundColor: primary + "15" },
                ]}
              >
                <ThemedText style={[styles.categoryText, { color: primary }]}>
                  {getCategoryTranslation(cat, language)}
                </ThemedText>
              </View>
            ))}
          </View>

          {item.description ? (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                {t("description", language)}
              </ThemedText>
              <ThemedText style={styles.description}>
                {item.description}
              </ThemedText>
            </View>
          ) : null}

          {item.tags.length > 0 && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                {t("tags", language)}
              </ThemedText>
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <TagChip key={tag} label={tag} index={index} />
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.logButton, { backgroundColor: primary + "20" }]}
              onPress={() => setIsCookModalVisible(true)}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color={primary}
              />
              <ThemedText style={[styles.logButtonText, { color: primary }]}>
                Cooked Today
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.editButton, { backgroundColor: primary }]}
              onPress={handleEdit}
            >
              <Ionicons
                name="create-outline"
                size={19}
                color={AppColors.white}
              />
              <ThemedText style={styles.editButtonText}>
                {t("edit", language)}
              </ThemedText>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons
                name="trash-outline"
                size={19}
                color={AppColors.danger}
              />
              <ThemedText style={styles.deleteButtonText}>
                {t("delete", language)}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={isCookModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !showConfetti && setIsCookModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
            <Ionicons name="restaurant" size={48} color={primary} style={{ marginBottom: 16 }} />
            <ThemedText style={styles.modalTitle}>Did you cook this today?</ThemedText>
            <ThemedText style={styles.modalText}>
              Logging this meal will update your history and improve recommendations.
            </ThemedText>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsCookModalVisible(false)}
                disabled={showConfetti}
              >
                <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: primary }]}
                onPress={handleLogCookConfirm}
                disabled={showConfetti}
              >
                <ThemedText style={styles.modalConfirmText}>Yes, I did!</ThemedText>
              </Pressable>
            </View>
          </View>
          {showConfetti && (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    opacity: 0.6,
  },
  imageContainer: {
    width: "100%",
    height: 280,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
    opacity: 0.6,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    paddingBottom: 40,
    flexWrap: "wrap",
  },
  logButton: {
    flexBasis: '100%',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  logButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.white,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: AppColors.danger + "15",
    paddingVertical: 14,
    borderRadius: 14,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.7,
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});
