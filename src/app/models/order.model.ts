export enum OrderStatus {
  Draft = 1,
  Cancelled = 2,
  Active = 3,
  Confirmed = 4,
  Completed = 5,
  Rejected = 6
}

export interface Order {
  id: number;
  orderNo: string;
  operationOrderNo: string;
  warehouseDocNo: string;
  date: string;
  createDate: string;
  companyName: string;
  paymentType: string;
  statusId: OrderStatus;
  statusValue: string;
  orderType: string;
  cargoName: string;
  finalAmount: number;
  cargoWeight: number;
  truckplate: string;
  warehouseName: string;
  typeOfVehicle: string;
  warehouseDoorName: string;
}

export interface OrderFilter {
  orderNo?: string;
  date?: string;
  companyName?: string;
  orderType?: string;
  paymentType?: string;
  createDate?: string;
  statusValue?: string;
}