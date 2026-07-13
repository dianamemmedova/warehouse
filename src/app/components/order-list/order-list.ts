import { Component, OnInit, ViewChild, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, OrderFilter } from '../../models/order.model';
import { OrderDialog, OrderDialogData } from '../order-dialog/order-dialog';
import { ConfirmDialog, ConfirmDialogData } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  displayedColumns: string[] = [
    'actions',
    'orderNo',
    'date',
    'companyName',
    'orderType',
    'paymentType',
    'createDate',
    'statusValue'
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

  filterForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.buildFilterForm();
    this.loadStats();
    this.loadPage(0, this.pageSize);
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      orderNo: [''],
      date: [''],
      companyName: [''],
      orderType: [''],
      paymentType: [''],
      createDate: [''],
      statusValue: ['']
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

  applyFilter() {
    const raw = this.filterForm.value;
    const filter: OrderFilter = {
      orderNo: raw.orderNo || undefined,
      companyName: raw.companyName || undefined,
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


  openCreateDialog() {
    const dialogRef = this.dialog.open(OrderDialog, {
      width: '700px',
      maxWidth: '95vw',
      data: { mode: 'create' } as OrderDialogData
    });

    dialogRef.afterClosed().subscribe((result: Order | undefined) => {
      if (result) {
        this.orderService.addOrder(result).subscribe(() => {
          this.snackBar.open('Sifariş uğurla əlavə edildi', 'Bağla', { duration: 3000 });
          this.loadStats();
          this.loadPage(0, this.pageSize);
        });
      }
    });
  }

  onView(order: Order) {
    this.dialog.open(OrderDialog, {
      width: '700px',
      maxWidth: '95vw',
      data: { mode: 'view', order } as OrderDialogData
    });
  }

  onEdit(order: Order) {
    const dialogRef = this.dialog.open(OrderDialog, {
      width: '700px',
      maxWidth: '95vw',
      data: { mode: 'edit', order } as OrderDialogData
    });

    dialogRef.afterClosed().subscribe((result: Order | undefined) => {
      if (result) {
        this.orderService.updateOrder(result).subscribe(() => {
          this.snackBar.open('Sifariş yeniləndi', 'Bağla', { duration: 3000 });
          this.loadStats();
          this.loadPage(this.paginator?.pageIndex || 0, this.pageSize);
        });
      }
    });
  }

  onDelete(order: Order) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Sifarişi sil',
        message: `"${order.orderNo}" nömrəli sifarişi silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`,
        confirmText: 'Sil',
        cancelText: 'Ləğv et',
        isDanger: true
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.orderService.deleteOrder(order.id).subscribe(() => {
          this.snackBar.open('Sifariş silindi', 'Bağla', { duration: 3000 });
          this.loadStats();
          this.loadPage(0, this.pageSize);
        });
      }
    });
  }

  excelExport() {
    this.snackBar.open('Excel export funksiyası (demo)', 'Bağla', { duration: 2000 });
  }
}