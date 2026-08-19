import { apiFetch } from './client';

export const getBlogs = () => apiFetch('/api/cms/blogs');
