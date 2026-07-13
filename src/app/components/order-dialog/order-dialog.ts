import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Order, OrderStatus } from '../../models/order.model';
import { ORDER_TYPES, PAYMENT_TYPES, STATUS_LABELS } from '../../constants/status.constants';

export interface OrderDialogData {
  mode: 'create' | 'edit' | 'view';
  order?: Order;
}

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order-dialog.html',
  styleUrl: './order-dialog.scss'
})
export class OrderDialog {
  form: FormGroup;
  orderTypes = ORDER_TYPES;
  paymentTypes = PAYMENT_TYPES;
  statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value: Number(value) as OrderStatus,
    label
  }));

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData
  ) {
    const order = data.order;

    this.form = this.fb.group({
      orderNo: [order?.orderNo || '', Validators.required],
      companyName: [order?.companyName || '', Validators.required],
      orderType: [order?.orderType || '', Validators.required],
      paymentType: [order?.paymentType || '', Validators.required],
      statusId: [order?.statusId || OrderStatus.Draft, Validators.required],
      cargoName: [order?.cargoName || ''],
      cargoWeight: [order?.cargoWeight || null, [Validators.required, Validators.min(0)]],
      finalAmount: [order?.finalAmount || null, [Validators.required, Validators.min(0)]],
      truckplate: [order?.truckplate || ''],
      warehouseName: [order?.warehouseName || ''],
      typeOfVehicle: [order?.typeOfVehicle || ''],
      warehouseDoorName: [order?.warehouseDoorName || '']
    });

    if (this.isViewMode) {
      this.form.disable();
    }
  }

  get isEditMode(): boolean {
    return this.data.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.data.mode === 'view';
  }

  get dialogTitle(): string {
    if (this.data.mode === 'view') return 'Sifariş məlumatı';
    if (this.data.mode === 'edit') return 'Sifarişi redaktə et';
    return 'Yeni sifariş';
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const statusLabel = STATUS_LABELS[formValue.statusId as OrderStatus];

    const result: Order = {
      id: this.data.order?.id || 0,
      operationOrderNo: this.data.order?.operationOrderNo || `OP-${Date.now()}`,
      warehouseDocNo: this.data.order?.warehouseDocNo || `WD-${Date.now()}`,
      date: this.data.order?.date || new Date().toISOString().slice(0, 10),
      createDate: this.data.order?.createDate || new Date().toISOString().slice(0, 10),
      statusValue: statusLabel,
      ...formValue
    };

    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }
}