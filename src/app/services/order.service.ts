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
      const contains = (value: string | undefined, target: string) => {
        if (!value) return true;
        return target.toLocaleLowerCase('az').includes(value.toLocaleLowerCase('az'));
      };

      result = result.filter(order =>
        contains(filter.orderNo, order.orderNo) &&
        contains(filter.date, order.date) &&
        contains(filter.companyName, order.companyName) &&
        contains(filter.orderType, order.orderType) &&
        contains(filter.paymentType, order.paymentType) &&
        contains(filter.createDate, order.createDate) &&
        contains(filter.statusValue, order.statusValue)
      );
    }

    const total = result.length;
    const start = page * pageSize;
    const pageData = result.slice(start, start + pageSize);

    return of({ data: pageData, total }).pipe(delay(400));
  }

  getOrderById(id: number): Observable<Order | undefined> {
    const found = this.orders().find(o => o.id === id);
    return of(found).pipe(delay(200));
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