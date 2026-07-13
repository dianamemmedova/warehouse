import { OrderStatus } from '../models/order.model';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Draft]: 'Qaralama',
  [OrderStatus.Cancelled]: 'Ləğv edilib',
  [OrderStatus.Active]: 'Aktiv',
  [OrderStatus.Confirmed]: 'Təsdiqlənib',
  [OrderStatus.Completed]: 'Tamamlanıb',
  [OrderStatus.Rejected]: 'Rədd edilib'
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