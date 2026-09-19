import axios from 'axios';
import { PicsumImage } from '@/types/gallery';

const BASE_URL = 'https://picsum.photos/v2/list';

/**
 * Fetches a single page of images from the Picsum API.
 * Throws on network/API failure so callers can decide how to surface it.
 */
export const fetchImagesPage = async (
  page: number,
  limit: number = 20
): Promise<PicsumImage[]> => {
  const response = await axios.get<PicsumImage[]>(BASE_URL, {
    params: { page, limit },
    timeout: 15000,
  });
  return response.data;
};
