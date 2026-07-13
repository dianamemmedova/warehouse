import { Routes } from '@angular/router';
import { OrderList } from './components/order-list/order-list';
import { OrderFormPage } from './pages/order-form/order-form';

export const routes: Routes = [
  { path: '', component: OrderList },
  { path: 'order-form', component: OrderFormPage }
];