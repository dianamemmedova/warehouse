import { OrderStatus } from '../models/order.model';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Draft]: 'Qaralama',
  [OrderStatus.Cancelled]: 'Ləğv edilib',
  [OrderStatus.Active]: 'Aktiv',
  [OrderStatus.Confirmed]: 'Təsdiqlənib',
  [OrderStatus.Completed]: 'Tamamlanıb',
  [OrderStatus.Rejected]: 'Rədd edilib'
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Draft]: '#9e9e9e',
  [OrderStatus.Cancelled]: '#e53935',
  [OrderStatus.Active]: '#1e88e5',
  [OrderStatus.Confirmed]: '#43a047',
  [OrderStatus.Completed]: '#00897b',
  [OrderStatus.Rejected]: '#d81b60'
};

export const ORDER_TYPES: string[] = [
  'İdxal',
  'İxrac',
  'Daxili daşınma',
  'Transit'
];

export const PAYMENT_TYPES: string[] = [
  'Nağd',
  'Bank köçürməsi',
  'Kredit'
];