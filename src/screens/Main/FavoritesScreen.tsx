import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ImageCard } from '@/components/ImageCard';
import { useGalleryStore } from '@/store/useGalleryStore';
import { useThemeStore } from '@/store/useThemeStore';
import { RootStackParamList } from '@/types/navigation';

type NavProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { favorites, toggleFavorite, loadFavorites, isFavoritesHydrated } = useGalleryStore();
  const { colors } = useThemeStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isFavoritesHydrated) loadFavorites();
  }, [isFavoritesHydrated, loadFavorites]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return favorites;
    return favorites.filter((f) => f.author.toLowerCase().includes(query));
  }, [favorites, search]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.searchRow,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search favorites by author..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            isFavorite
            onPress={() => navigation.navigate('ImageDetail', { image: item })}
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {favorites.length === 0
              ? 'No favorites yet. Tap the heart icon on any image to save it here.'
              : 'No favorites match your search.'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15 },
  listContent: { padding: 16, paddingBottom: 30 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14, paddingHorizontal: 20 },
});