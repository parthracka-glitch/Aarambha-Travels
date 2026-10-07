import { getApiBaseUrl } from './client';

export interface UploadResponse {
  success: boolean;
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadImage(file: File, folder = 'aarambha_travels'): Promise<UploadResponse> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.detail || 'Image upload failed');
  }

  return res.json();
}

export async function getUploadStatus(): Promise<{ configured: boolean; cloudName: string | null; message: string }> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/upload/status`);
  if (!res.ok) throw new Error('Failed to fetch upload status');
  return res.json();
}
