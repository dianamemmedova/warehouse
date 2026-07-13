import { Component, OnInit, ViewChild, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import { STATUS_COLORS } from '../../constants/status.constants';


@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {
  constructor(private orderService: OrderService) {}

  displayedColumns: string[] = [
    'orderNo',
    'companyName',
    'orderType',
    'cargoWeight',
    'truckplate',
    'warehouseName',
    'statusValue',
    'actions'
  ];

  dataSource = new MatTableDataSource<Order>([]);
  isLoading = signal<boolean>(false);
  totalCount = signal<number>(0);
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];

  allOrders = signal<Order[]>([]);
  statCount = computed(() => this.allOrders().length);
  activeCount = computed(() => this.allOrders().filter(o => o.statusId === OrderStatus.Active).length);
  completedCount = computed(() => this.allOrders().filter(o => o.statusId === OrderStatus.Completed).length);
  cancelledCount = computed(() => this.allOrders().filter(o => o.statusId === OrderStatus.Cancelled).length);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadStats();
    this.loadPage(0, this.pageSize);
  }

  loadStats() {
    this.orderService.getOrders(undefined, 0, 9999).subscribe(res => {
      this.allOrders.set(res.data);
    });
  }

  loadPage(page: number, pageSize: number) {
    this.isLoading.set(true);
    this.orderService.getOrders(undefined, page, pageSize).subscribe(res => {
      this.dataSource.data = res.data;
      this.totalCount.set(res.total);
      this.isLoading.set(false);
    });
  }

  onPageChange(event: PageEvent) {
    this.loadPage(event.pageIndex, event.pageSize);
  }

  getStatusColor(statusId: OrderStatus): string {
    return STATUS_COLORS[statusId];
  }

  onView(order: Order) {
    console.log('Bax:', order);
  }

  onEdit(order: Order) {
    console.log('Redaktə et:', order);
  }

  onDelete(order: Order) {
    console.log('Sil:', order);
  }
}