import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ICONS } from '../../constants/icons';
import { BoxComponent } from '../box/box';
import { ClockComponent } from '../clock/clock';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, BoxComponent, ClockComponent],
  templateUrl: './dashboard-header.html',
})
export class DashboardHeaderComponent {

    constructor(private sanitizer: DomSanitizer) {}

    @Input() todayOrders = 0;
    @Input() pendingPedidosYa = 0;
    @Input() inPreparation = 0;
    @Input() finishedOrders = 0;
    @Input() successRate = 0;

    public icons = ICONS;
    safeIcon!: SafeHtml;

    ngOnInit() {
        this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icons.clock);
    }

  get boxes() {
    return [
      {
        icon: this.icons.orders,
        text: 'Órdenes hoy',
        value: this.todayOrders
      },
      {
        icon: this.icons.preparation,
        text: 'En preparación',
        value: this.inPreparation
      },
      {
        icon: this.icons.completed,
        text: 'Completadas',
        value: this.finishedOrders
      },
      {
        icon: this.icons.success,
        text: 'Cumplimiento',
        value: `${this.successRate}%`
      }
    ];
  }
}