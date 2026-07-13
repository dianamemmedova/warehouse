import { Component } from '@angular/core';
import { OrderList } from './components/order-list/order-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OrderList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}