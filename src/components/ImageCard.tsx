import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '@/types/gallery';

interface ImageCardProps {
  image: PicsumImage;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  // Request a smaller thumbnail instead of downloading the full-res image
  const thumbnailUrl = `https://picsum.photos/id/${image.id}/300/300`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.infoRow}>
        <View style={styles.textBlock}>
          <Text style={styles.author} numberOfLines={1}>
            {image.author}
          </Text>
          <Text style={styles.id}>ID: {image.id}</Text>
        </View>
        <TouchableOpacity
          onPress={onToggleFavorite}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#EF4444' : '#6B7280'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: { width: '100%', height: 180, backgroundColor: '#E5E7EB' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textBlock: { flex: 1, marginRight: 8 },
  author: { fontSize: 15, fontWeight: '600', color: '#111827' },
  id: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});
