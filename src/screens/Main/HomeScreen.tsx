import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ImageCard } from '@/components/ImageCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useFetchImages } from '@/hooks/useFetchImages';
import { useDebounce } from '@/hooks/useDebounce';
import { useGalleryStore } from '@/store/useGalleryStore';
import { useThemeStore } from '@/store/useThemeStore';
import { FilterMode, PicsumImage } from '@/types/gallery';
import { RootStackParamList } from '@/types/navigation';

type NavProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const FILTERS: { label: string; value: FilterMode }[] = [
  { label: 'All Images', value: 'ALL' },
  { label: 'A-M', value: 'A-M' },
  { label: 'N-Z', value: 'N-Z' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { images, loading, loadingMore, refreshing, error, loadMore, refresh } = useFetchImages();
  const { favorites, toggleFavorite, loadFavorites, isFavoritesHydrated } = useGalleryStore();
  const { colors } = useThemeStore();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');

  useEffect(() => {
    if (!isFavoritesHydrated) loadFavorites();
  }, [isFavoritesHydrated, loadFavorites]);

  const filteredImages = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return images.filter((img) => {
      const matchesSearch = query === '' || img.author.toLowerCase().includes(query);

      const firstChar = img.author.trim().charAt(0).toUpperCase();
      let matchesFilter = true;
      if (filterMode === 'A-M') matchesFilter = firstChar >= 'A' && firstChar <= 'M';
      if (filterMode === 'N-Z') matchesFilter = firstChar >= 'N' && firstChar <= 'Z';

      return matchesSearch && matchesFilter;
    });
  }, [images, debouncedSearch, filterMode]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const renderItem = ({ item }: { item: PicsumImage }) => (
    <ImageCard
      image={item}
      isFavorite={favoriteIds.has(item.id)}
      onPress={() => navigation.navigate('ImageDetail', { image: item })}
      onToggleFavorite={() => toggleFavorite(item)}
    />
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading images..." />;
  }

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
          placeholder="Search by author..."
          placeholderTextColor={colors.textSecondary}
          value={searchInput}
          onChangeText={setSearchInput}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setFilterMode(f.value)}
            style={[
              styles.filterChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
              filterMode === f.value && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: colors.text },
                filterMode === f.value && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.errorBanner}>{error}</Text>}

      <FlatList
        data={filteredImages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No images match your search/filter.
          </Text>
        }
        ListFooterComponent={loadingMore ? <LoadingSpinner message="Loading more..." /> : null}
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
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: { fontSize: 13, fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  listContent: { padding: 16, paddingBottom: 30 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    fontSize: 13,
  },
});