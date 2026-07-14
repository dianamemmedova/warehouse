import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import { ORDER_TYPES, PAYMENT_TYPES, STATUS_LABELS } from '../../constants/status.constants';
import { MatDividerModule } from '@angular/material/divider';
type FormMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss'
})
export class OrderFormPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  mode = signal<FormMode>('create');
  orderId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  existingOrder: Order | null = null;

  orderTypes = ORDER_TYPES;
  paymentTypes = PAYMENT_TYPES;
  statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value: Number(value) as OrderStatus,
    label
  }));

  form!: FormGroup;

  isViewMode = computed(() => this.mode() === 'view');
  isEditMode = computed(() => this.mode() === 'edit');

  pageTitle = computed(() => {
    if (this.mode() === 'view') return 'Sifariş məlumatı';
    if (this.mode() === 'edit') return 'Sifarişi redaktə et';
    return 'Yeni sifariş';
  });

  ngOnInit() {
    this.buildForm();

    this.route.queryParamMap.subscribe(params => {
      const mode = (params.get('mode') as FormMode) || 'create';
      const id = params.get('orderId');
      this.mode.set(mode);
      this.orderId.set(id ? Number(id) : null);

      if (mode !== 'create' && this.orderId()) {
        this.loadOrder(this.orderId()!);
      }

      if (this.isViewMode()) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      orderNo: ['', Validators.required],
      companyName: ['', Validators.required],
      orderType: ['', Validators.required],
      paymentType: ['', Validators.required],
      statusId: [OrderStatus.Draft, Validators.required],
      cargoName: [''],
      cargoWeight: [null, [Validators.required, Validators.min(0)]],
      finalAmount: [null, [Validators.required, Validators.min(0)]],
      truckplate: [''],
      warehouseName: [''],
      typeOfVehicle: [''],
      warehouseDoorName: ['']
    });
  }

  loadOrder(id: number) {
    this.isLoading.set(true);
    this.orderService.getOrderById(id).subscribe(order => {
      this.isLoading.set(false);
      if (order) {
        this.existingOrder = order;
        this.form.patchValue(order);
        if (this.isViewMode()) {
          this.form.disable();
        }
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const statusLabel = STATUS_LABELS[formValue.statusId as OrderStatus];

    const result: Order = {
      id: this.existingOrder?.id || 0,
      operationOrderNo: this.existingOrder?.operationOrderNo || `OP-${Date.now()}`,
      warehouseDocNo: this.existingOrder?.warehouseDocNo || `WD-${Date.now()}`,
      date: this.existingOrder?.date || new Date().toISOString().slice(0, 10),
      createDate: this.existingOrder?.createDate || new Date().toISOString().slice(0, 10),
      statusValue: statusLabel,
      ...formValue
    };

    const request$ = this.isEditMode()
      ? this.orderService.updateOrder(result)
      : this.orderService.addOrder(result);

    request$.subscribe(() => {
      this.snackBar.open(
        this.isEditMode() ? 'Sifariş yeniləndi' : 'Sifariş əlavə edildi',
        'Bağla',
        { duration: 3000 }
      );
      this.goBack();
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}