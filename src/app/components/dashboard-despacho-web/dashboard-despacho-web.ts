import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../Service/services.services';
import Swal from 'sweetalert2';
import { ICONS } from '../../constants/icons';
import { Order } from "../order/order";
import { timeout } from 'rxjs';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header';
import { OrdersPanelComponent } from '../orders-panel/orders-panel';
import { CouriersPanelComponent } from '../couriers-panel/couriers-panel';
import { AlertsPanelComponent } from '../alerts-panel/alerts-panel';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DashboardHeaderComponent,
    OrdersPanelComponent,
    CouriersPanelComponent,
    AlertsPanelComponent,
    
],
  templateUrl: './dashboard-despacho-web.html',
})

export class DashboardComponent implements OnInit {
  constructor(
    private ruta: Router, 
    private service: ServiceService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  public loader = false;
  public ordersLoading = true;
  public couriersLoading = true;

  public pedidosYaOverdueOrders: number = 0;
  public pedidosYaLastMinuteOrders: number = 0;
  public pedidosYaSlowOrders: number = 0;

  public todayOrders = 0;
  public pendingPedidosYa = 0;
  public inPreparation = 0;
  public finishedOrders = 0;
  public successRate = 0;

  public clockIcon : SafeHtml | undefined;

  ngOnInit(): void {
    this.clockIcon = this.sanitizer.bypassSecurityTrustHtml(ICONS.clock);
    this.checkLoadingState();
  }

  private checkLoadingState(): void {
    this.loader = this.ordersLoading || this.couriersLoading;
    this.cdr.detectChanges();
  }

  // Recibe datos del orders-panel
  onOrdersLoaded(orders: Order[]): void {
    this.todayOrders = orders.length;
    this.finishedOrders = orders.filter(o => o.timeState === 'finished').length;

    if (orders.length > 0) {
      this.successRate = this.calculateSuccessRate(orders);
    }

    this.cdr.detectChanges();
  }

  calculateSuccessRate(orders: Order[]) : number {
    return Math.round((this.finishedOrders / orders.length) * 100);
  }

  onFilteredOrdersLoaded(filteredOrders: Order[]) : void {
    this.pendingPedidosYa = filteredOrders.filter(o => o.timeState !== 'finished').length;
    this.inPreparation = filteredOrders.filter(o => o.timeState !== 'finished').length;
    this.pedidosYaSlowOrders = filteredOrders.filter(o => o.timeState === 'slow').length;
  }

  onOrdersLoadingChange(loading: boolean): void {
    this.ordersLoading = loading;
    this.checkLoadingState();
  }

  onCouriersLoadingChange(loading: boolean): void {
    this.couriersLoading = loading;
    this.checkLoadingState();
  }

  private calculatePastDaysOrders(orders: Order[]): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return orders.filter(order => {
      const orderDate = new Date(order.ingreso);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate < today && order.timeState !== 'Completada';
    }).length;
  }

  errorMessage(message : string) : void {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    });
  }
}