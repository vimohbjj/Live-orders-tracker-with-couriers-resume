import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter, OnDestroy  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../Service/services.services';
import Swal from 'sweetalert2';
import { Order, OrderComponent } from "../order/order";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrderComponent
],
  templateUrl: './orders-panel.html',
})

export class OrdersPanelComponent implements OnInit, OnDestroy {

  constructor(
    private ruta: Router, 
    private service: ServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  @Output() ordersLoaded = new EventEmitter<Order[]>(); // Emitir datos al padre si necesita
  @Output() filteredOrdersLoaded = new EventEmitter<Order[]>(); // Emitir datos al padre si necesita
  @Output() loadingChange = new EventEmitter<boolean>();

public pedidosYaMockOrders: Order[] = [
  {
    id: 1062301,
    courier: "PEDIDOSYA",
    ingreso: "10:15",
    stock: 3,
    timeState: "ok",
    orderState: "AGREGADA",
    type: "Express",
    description: "Entrega rápida",
    pickUpTime: "12-12:30"
  },
  {
    id: 1062302,
    courier: "PEDIDOSYA",
    ingreso: "10:45",
    stock: 1,
    timeState: "ok",
    orderState: "CONFIRMADA",
    type: "Express",
    description: "Entrega rápida",
    pickUpTime: "13-13:30"
  },
  {
    id: 1062303,
    courier: "PEDIDOSYA",
    ingreso: "11:20",
    stock: 5,
    timeState: "ok",
    orderState: "DESCARGADA",
    type: "Standard",
    description: "Entrega normal",
    pickUpTime: "14-14:30"
  },
  {
    id: 1062304,
    courier: "PEDIDOSYA",
    ingreso: "11:55",
    stock: 2,
    timeState: "slow",
    orderState: "AGREGADA",
    type: "Express",
    description: "Entrega rápida",
    pickUpTime: "13-13:30"
  },
  {
    id: 1062305,
    courier: "PEDIDOSYA",
    ingreso: "12:10",
    stock: 4,
    timeState: "slow",
    orderState: "CONFIRMADA",
    type: "Standard",
    description: "Entrega normal",
    pickUpTime: "14-14:30"
  },
  {
    id: 1062306,
    courier: "PEDIDOSYA",
    ingreso: "12:15",
    stock: 1,
    timeState: "warning",
    orderState: "DESCARGADA",
    type: "Express",
    description: "Entrega rápida",
    pickUpTime: "13-13:30"
  },
  {
    id: 1062307,
    courier: "PEDIDOSYA",
    ingreso: "12:25",
    stock: 2,
    timeState: "warning",
    orderState: "CONFIRMADA",
    type: "Standard",
    description: "Entrega normal",
    pickUpTime: "13-13:30"
  },
  {
    id: 1062308,
    courier: "PEDIDOSYA",
    ingreso: "12:45",
    stock: 3,
    timeState: "overdue",
    orderState: "SIN_PROCESAR",
    type: "Express",
    description: "Entrega rápida",
    pickUpTime: "12-12:30"
  },
  {
    id: 1062309,
    courier: "PEDIDOSYA",
    ingreso: "12:50",
    stock: 1,
    timeState: "overdue",
    orderState: "ANULADA",
    type: "Standard",
    description: "Entrega normal",
    pickUpTime: "12-12:30"
  },
  {
    id: 1062310,
    courier: "PEDIDOSYA",
    ingreso: "13:57",
    stock: 2,
    timeState: "finished",
    orderState: "FACTURADA",
    type: "Express",
    description: "Entrega rápida",
    pickUpTime: "14"
  }
];
  public orders : Order[] = [];
  public filteredOrders : Order[] = [];
  public pedidosYaOrders : Order [] = [];

  public activeOrders : number = 0; // activas
  public approachingDeadlineOrders : number = 0; // al limite 
  public lastMinuteOrders : number = 0; //  ultimo minuto
  public overdueOrders : number = 0; // atrasadas

  private readonly MAX_HOURS = 2;   
  public loading = true;
  private pollingSubscription!: Subscription;


  ngOnInit(): void {
    this.startPolling();
  }

  startPolling(): void {
    this.loading = true;
    this.loadingChange.emit(true);
    
    this.pollingSubscription = this.service.getOrdersPolling(30).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.storeOrders(data);
          this.setAlert();
          this.ordersLoaded.emit(this.orders);
          this.filteredOrdersLoaded.emit(this.filteredOrders);
        }
        this.loading = false;
        this.loadingChange.emit(false);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage(error.Detail);
        this.loading = false;
        this.loadingChange.emit(false);
        this.cdr.detectChanges();
      }
    });
  }

  storeOrders(orders : Order[]){
    this.orders = orders;
    this.filteredOrders = this.filterFinishedOrders(orders);
    this.pedidosYaOrders = this.filterFinishedPedidosYaOrders(orders);
  }

  storeData(orders : Order[]) : void {
    this.storeOrders(orders);
    this.setAlert();
  }

  setAlert() : void {
    this.overdueOrders = this.filteredOrders.filter(o => o.timeState === 'overdue').length;
    this.lastMinuteOrders = this.filteredOrders.filter(o => o.timeState === 'warning').length;
    this.approachingDeadlineOrders = this.filteredOrders.filter(o => o.timeState === 'slow').length;
    this.activeOrders = this.filteredOrders.filter(o => o.timeState === 'ok').length;
  }

  private filterFinishedOrders(orders: Order[]): Order[] {
    return orders.filter(o => o.timeState !== "finished" && o.courier !== 'pedidosYa');
  }

  private filterFinishedPedidosYaOrders(orders: Order[]): Order[] {
    return orders.filter(o => o.timeState !== "finished" && o.courier === 'pedidosYa');
  }

  onTimeStateChange(event: { id: number; newTimeState: string }): void {
    let order = this.filteredOrders.find(o => o.id === event.id);
    
    // Si no está, buscar en pedidosYaMockOrders
    if (!order) {
      order = this.pedidosYaMockOrders.find(o => o.id === event.id);
    }

    if (order && order.timeState !== event.newTimeState) {
      order.timeState = event.newTimeState;
      this.setAlert();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  errorMessage(message : string) : void {
    Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    });
  }
}