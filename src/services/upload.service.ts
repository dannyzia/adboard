import { api } from './api';
import type { AxiosProgressEvent } from 'axios';

// Note: we intentionally use loose response casts below to avoid tight coupling
// with the Api wrapper's AxiosResponse type signatures.

export const uploadService = {
  /**
   * Upload a single image to Cloudinary
   */
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = (await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })) as any;

    return response.data?.data;
  },

  /**
   * Upload multiple images to Cloudinary (max 5)
   */
  async uploadImages(
    files: File[],
    onProgress?: (percent: number) => void
  ): Promise<Array<{ url: string; publicId: string }>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    // Try upload with a small retry/backoff strategy to handle transient network errors
    const maxAttempts = 3;
    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        // use a looser response cast to avoid mismatches with our Api wrapper
        const response = (await api.post('/upload/multiple', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Axios onUploadProgress will be available on the underlying http client
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (onProgress && progressEvent?.total && typeof progressEvent.loaded === 'number') {
              const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
              try {
                onProgress(percent);
              } catch (e) {
                // ignore progress callback errors
              }
            }
          },
        })) as any;

        return response.data?.data || [];
      } catch (err) {
        attempt += 1;
        if (attempt >= maxAttempts) {
          throw err;
        }
        // Wait a bit before retrying (exponential backoff)
        const waitMs = 300 * Math.pow(2, attempt - 1);
        await new Promise((res) => setTimeout(res, waitMs));
      }
    }

    return [];
  },

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    const encodedPublicId = encodeURIComponent(publicId);
    await api.delete(`/upload/${encodedPublicId}`);
  },
};
