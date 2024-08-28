export interface PaginationResponse<T> {
  totalElements: number,
  totalPages: number,
  size: number,
  content: T[],
}
