export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getPaginationParams = (query: any) => {
  const page = Math.max(1, parseInt(query.page as string, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit as string, 10) || 50));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
