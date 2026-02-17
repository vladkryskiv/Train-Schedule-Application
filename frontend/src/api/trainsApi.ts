import type { TrainDto, SortableField, SortDirection, PaginatedResponse } from '../types/train.types';
import { API_URL } from '../constants/api.constants';

const API_BASE = `${API_URL}/trains`;

function buildHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchTrains(
  token: string,
  params: {
    search?: string;
    sortBy?: SortableField;
    sortDirection?: SortDirection;
    page?: number;
    limit?: number;
  },
): Promise<PaginatedResponse<TrainDto>> {
  const query = new URLSearchParams();
  if (params.search?.trim()) query.append('search', params.search.trim());
  if (params.sortBy) query.append('sortBy', params.sortBy);
  query.append('sortDirection', params.sortDirection ?? 'asc');
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const response = await fetch(`${API_BASE}?${query.toString()}`, {
    headers: buildHeaders(token),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Не вдалося завантажити розклад');
  }

  return response.json();
}

export async function createTrain(
  token: string,
  body: Omit<TrainDto, 'id'>,
): Promise<TrainDto> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Не вдалося створити поїзд');
  }

  return response.json();
}

export async function updateTrain(
  token: string,
  id: number,
  body: Partial<Omit<TrainDto, 'id'>>,
): Promise<TrainDto> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Не вдалося оновити поїзд');
  }

  return response.json();
}

export async function deleteTrain(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Не вдалося видалити поїзд');
  }
}
