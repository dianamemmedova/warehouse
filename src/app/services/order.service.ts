import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order, OrderFilter } from '../models/order.model';
import { MOCK_ORDERS } from '../data/mock-orders';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders = signal<Order[]>([...MOCK_ORDERS]);

  getOrders(filter?: OrderFilter, page: number = 0, pageSize: number = 10): Observable<{ data: Order[]; total: number }> {
    let result = this.orders();

    if (filter) {
      result = result.filter(order => {
        const matchesOrderNo = !filter.orderNo || order.orderNo.toLowerCase().includes(filter.orderNo.toLowerCase());
        const matchesCompany = !filter.companyName || order.companyName.toLowerCase().includes(filter.companyName.toLowerCase());
        const matchesStatus = !filter.statusId || order.statusId === filter.statusId;
        const matchesType = !filter.orderType || order.orderType === filter.orderType;
        return matchesOrderNo && matchesCompany && matchesStatus && matchesType;
      });
    }

    const total = result.length;
    const start = page * pageSize;
    const pageData = result.slice(start, start + pageSize);

    return of({ data: pageData, total }).pipe(delay(400));
  }

  addOrder(order: Order): Observable<Order> {
    this.orders.update(current => [{ ...order, id: current.length + 1 }, ...current]);
    return of(order).pipe(delay(300));
  }

  updateOrder(updated: Order): Observable<Order> {
    this.orders.update(current => current.map(o => o.id === updated.id ? updated : o));
    return of(updated).pipe(delay(300));
  }

  deleteOrder(id: number): Observable<boolean> {
    this.orders.update(current => current.filter(o => o.id !== id));
    return of(true).pipe(delay(300));
  }
}