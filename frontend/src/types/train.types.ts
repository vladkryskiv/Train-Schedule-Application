export interface TrainDto {
  id: number;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  trainNumber: string;
}

export type SortDirection = 'asc' | 'desc';
export type SortableField = 'departureTime' | 'arrivalTime' | 'price' | 'trainNumber';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
