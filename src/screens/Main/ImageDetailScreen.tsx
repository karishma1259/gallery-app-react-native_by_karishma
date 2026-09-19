import React, { useState } from 'react';
import { Alert, Image, Share, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { RootStackParamList } from '@/types/navigation';

type Props = StackScreenProps<RootStackParamList, 'ImageDetail'>;

export const ImageDetailScreen: React.FC<Props> = ({ route }) => {
  const { image } = route.params;
  const [downloading, setDownloading] = useState(false);
  const fullUrl = `https://picsum.photos/id/${image.id}/${image.width}/${image.height}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to save images to your gallery.');
        return;
      }

      const fileUri = `${FileSystem.cacheDirectory}picsum-${image.id}.jpg`;
      const { uri } = await FileSystem.downloadAsync(fullUrl, fileUri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('GalleryApp', asset, false);

      Alert.alert('Saved', 'Image saved to your device gallery.');
    } catch (e) {
      Alert.alert('Download failed', 'Something went wrong while saving the image.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: fullUrl });
    } catch (e) {
      // user cancelled or share failed silently
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: fullUrl }} style={styles.image} resizeMode="contain" />

      <View style={styles.infoCard}>
        <Text style={styles.author}>{image.author}</Text>
        <Text style={styles.meta}>Image ID: {image.id}</Text>
        <Text style={styles.meta}>
          Dimensions: {image.width} × {image.height}
        </Text>

        <View style={styles.actionsRow}>
          <Button
            label={downloading ? 'Saving...' : 'Download'}
            onPress={handleDownload}
            loading={downloading}
            style={styles.actionButton}
          />
          <Button
            label="Share"
            variant="secondary"
            onPress={handleShare}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { flex: 1, width: '100%' },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  author: { fontSize: 20, fontWeight: '700', color: '#111827' },
  meta: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  actionsRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  actionButton: { flex: 1 },
});
