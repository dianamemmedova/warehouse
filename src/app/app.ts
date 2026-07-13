import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { OrderList } from './components/order-list/order-list';

@Component({
  selector: 'app-root',
  imports:  [MatToolbarModule, MatIconModule, OrderList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
   title = 'Anbar Sifariş İdarəetməsi';
}
