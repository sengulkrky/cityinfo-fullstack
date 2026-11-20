export interface Pagination {
  totalItemCount: number;
  totalPageCount: number;
  pageSize: number;
  currentPage: number;
}

export interface PagedResult<T> {
  items: T[];
  pagination: Pagination;
}
