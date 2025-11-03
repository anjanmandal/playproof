import { apiClient, unwrap } from './client';

export interface UploadResult {
  filename: string;
  url: string;
  mimetype: string;
  size: number;
}

export const uploadMedia = (file: Blob | File, filename: string, mimetype?: string) => {
  const formData = new FormData();
  formData.append(
    'file',
    file instanceof File ? file : new File([file], filename, { type: mimetype ?? file.type }),
  );

  return unwrap(apiClient.post<UploadResult>('/media/upload', formData));
};
