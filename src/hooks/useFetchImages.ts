import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchImagesPage } from '@/api/picsumApi';
import { PicsumImage } from '@/types/gallery';

const PAGE_SIZE = 20;

interface UseFetchImagesResult {
  images: PicsumImage[];
  loading: boolean; // true only for the very first load
  loadingMore: boolean; // true while appending a subsequent page
  refreshing: boolean; // true during pull-to-refresh
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Handles paginated fetching of the Picsum image list.
 * A ref-based guard prevents duplicate/concurrent requests from
 * onEndReached firing multiple times or overlapping with pull-to-refresh.
 */
export const useFetchImages = (): UseFetchImagesResult => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  const runFetch = useCallback(async (pageNum: number, mode: 'initial' | 'more' | 'refresh') => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (mode === 'initial') setLoading(true);
    if (mode === 'more') setLoadingMore(true);
    if (mode === 'refresh') setRefreshing(true);
    setError(null);

    try {
      const data = await fetchImagesPage(pageNum, PAGE_SIZE);
      setHasMore(data.length === PAGE_SIZE);
      setImages((prev) => (mode === 'more' ? [...prev, ...data] : data));
    } catch (e) {
      setError('Could not load images. Pull down to try again.');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    runFetch(1, 'initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    runFetch(nextPage, 'more');
  }, [page, hasMore, runFetch]);

  const refresh = useCallback(() => {
    if (isFetchingRef.current) return;
    setPage(1);
    setHasMore(true);
    runFetch(1, 'refresh');
  }, [runFetch]);

  return { images, loading, loadingMore, refreshing, error, loadMore, refresh };
};
