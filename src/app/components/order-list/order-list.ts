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
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderFilter } from '../../models/order.model';
import { ORDER_TYPES } from '../../constants/status.constants';


@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
  DecimalPipe,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
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
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ) { }
  filterForm!: FormGroup;
  orderTypes = ORDER_TYPES;
  statusOptions = [
    { value: OrderStatus.Draft, label: 'Qaralama' },
    { value: OrderStatus.Active, label: 'Aktiv' },
    { value: OrderStatus.Confirmed, label: 'Təsdiqlənib' },
    { value: OrderStatus.Completed, label: 'Tamamlanıb' },
    { value: OrderStatus.Cancelled, label: 'Ləğv edilib' },
    { value: OrderStatus.Rejected, label: 'Rədd edilib' }
  ];

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
    this.buildFilterForm();
    this.loadStats();
    this.loadPage(0, this.pageSize);
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      orderNo: [''],
      companyName: [''],
      statusId: [null],
      orderType: [''],
      dateFrom: [null],
      dateTo: [null]
    });
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
  applyFilter() {
    const raw = this.filterForm.value;
    const filter: OrderFilter = {
      orderNo: raw.orderNo || undefined,
      companyName: raw.companyName || undefined,
      statusId: raw.statusId || undefined,
      orderType: raw.orderType || undefined
    };

    this.isLoading.set(true);
    this.orderService.getOrders(filter, 0, this.pageSize).subscribe(res => {
      this.dataSource.data = res.data;
      this.totalCount.set(res.total);
      this.isLoading.set(false);
      if (this.paginator) {
        this.paginator.firstPage();
      }
    });
  }

  resetFilter() {
    this.filterForm.reset();
    this.loadPage(0, this.pageSize);
  }

  onDelete(order: Order) {
    console.log('Sil:', order);
  }
}