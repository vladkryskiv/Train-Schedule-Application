import type { Train } from '../train.entity';

export const SEARCH_FIELDS: (keyof Train)[] = [
  'fromStation',
  'toStation',
  'trainNumber',
];
