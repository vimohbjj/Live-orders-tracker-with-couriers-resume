// order.ts
import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { OrderTimerComponent, TimerStatus } from '../order-timer/order-timer';
import { CourierTimerComponent } from '../courier pick up timer/courirer-pick-up-timer';

export interface Order {
    id: number;
    courier: string | null;
    ingreso: any;
    stock: number;
    timeState: string;
    orderState: string;
    type: string;
    description: string;
    pickUpTime?: string;
}

@Component({
    selector: 'app-order',
    standalone: true,
    imports: [CommonModule, OrderTimerComponent, CourierTimerComponent],
    templateUrl: './order.html'
})
export class OrderComponent {
    @Input() id!: number;
    @Input() stock!: number;
    @Input() ingreso!: string;
    @Input() timeState!: string;
    @Input() orderState!: string;
    @Input() courier!: string | null;
    @Input() pickUpTime?: string;
    
    @Output() timeStateChange = new EventEmitter<{ id: number; newTimeState: string }>();

    public orderClass: string = 'border-2 border-(--border) bg-(--secondary_bg)';

    constructor(private cdr: ChangeDetectorRef) {}

    onTimerStatusChange(status: TimerStatus): void {
        this.orderClass = this.getOrderClass(status);
        
        // Solo emitir si el estado cambió
        if (this.timeState !== status) {
            this.timeStateChange.emit({ id: this.id, newTimeState: status });
        }
        
        this.cdr.detectChanges();
    }

    private getOrderClass(status: TimerStatus): string {
        switch (status) {
            case 'overdue':
                return 'border-2 bg-(--primary_red) border-(--secondary_red)';
            case 'warning':
                return 'border-2 bg-(--primary_orange) border-(--secondary_orange)';
            case 'slow':
                return 'border-2 bg-(--primary_yellow) border-(--secondary_yellow)';
            case 'ok':
                return 'border-2 bg-(--primary_green) border-(--secondary_green)';
            default:
                return 'border-2 border-(--border) bg-(--secondary_bg)';
        }
    }
}