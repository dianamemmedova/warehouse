import { Order, OrderStatus } from '../models/order.model';
import { STATUS_LABELS } from '../constants/status.constants';

function buildOrder(id: number, statusId: OrderStatus): Order {
  return {
    id,
    orderNo: `SF-${1000 + id}`,
    operationOrderNo: `OP-${2000 + id}`,
    warehouseDocNo: `WD-${3000 + id}`,
    date: `2026-0${(id % 6) + 1}-1${id % 9}`,
    createDate: `2026-0${(id % 6) + 1}-0${(id % 9) + 1}`,
    companyName: ['Food City MMC', 'Agro Trade LLC', 'Baku Logistics', 'Cargo Express'][id % 4],
    paymentType: ['Nağd', 'Bank köçürməsi', 'Kredit'][id % 3],
    statusId,
    statusValue: STATUS_LABELS[statusId],
    orderType: ['İdxal', 'İxrac', 'Daxili daşınma', 'Transit'][id % 4],
    cargoName: ['Un', 'Şəkər', 'Meyvə-tərəvəz', 'Konserv'][id % 4],
    finalAmount: 500 + id * 37.5,
    cargoWeight: 1000 + id * 120,
    truckplate: `10-${String(id).padStart(3, '0')}-AA`,
    warehouseName: ['Anbar A', 'Anbar B', 'Anbar C'][id % 3],
    typeOfVehicle: ['Yük maşını', 'Qatar', 'Konteyner'][id % 3],
    warehouseDoorName: `Qapı-${(id % 5) + 1}`
  };
}

const statuses: OrderStatus[] = [
  OrderStatus.Draft,
  OrderStatus.Active,
  OrderStatus.Confirmed,
  OrderStatus.Completed,
  OrderStatus.Cancelled,
  OrderStatus.Rejected
];

export const MOCK_ORDERS: Order[] = Array.from({ length: 45 }, (_, i) =>
  buildOrder(i + 1, statuses[i % statuses.length])
);