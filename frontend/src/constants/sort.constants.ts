import type { SortableField } from '../types/train.types';

export const SORT_FIELD_LABELS: Record<SortableField, string> = {
  departureTime: 'Відправлення',
  arrivalTime: 'Прибуття',
  price: 'Ціна',
  trainNumber: 'Номер поїзда',
};
