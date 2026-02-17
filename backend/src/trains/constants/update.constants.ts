import type { UpdateTrainDto } from '../dto/update-train.dto';

export const UPDATEABLE_FIELDS: (keyof UpdateTrainDto)[] = [
  'fromStation',
  'toStation',
  'price',
  'trainNumber',
];
