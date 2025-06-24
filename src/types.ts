export interface ApiResource {
  name: string;
  url: string;
}
  
export interface PaginatedResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ApiResource[];
}