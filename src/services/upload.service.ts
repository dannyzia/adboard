import { api } from './api';

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    publicId: string;
  };
}

interface MultipleUploadResponse {
  success: boolean;
  message: string;
  data: Array<{
    url: string;
    publicId: string;
  }>;
}

export const uploadService = {
  /**
   * Upload a single image to Cloudinary
   */
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  /**
   * Upload multiple images to Cloudinary (max 5)
   */
  async uploadImages(files: File[]): Promise<Array<{ url: string; publicId: string }>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<MultipleUploadResponse>('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    const encodedPublicId = encodeURIComponent(publicId);
    await api.delete(`/upload/${encodedPublicId}`);
  },
};
