import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from '../../constants/icons';
import { Courier, CourierComponent } from '../courier/courier';
import { ServiceService } from '../../Service/services.services';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-couriers-panel',
    standalone: true,
    imports: [CommonModule, CourierComponent],
    templateUrl: './couriers-panel.html',
})

export class CouriersPanelComponent implements OnInit {

    constructor(
        private sanitizer: DomSanitizer,
        private service: ServiceService,
        private cdr: ChangeDetectorRef
    ) {}

    @Output() couriersLoaded = new EventEmitter<Courier[]>();
    @Output() loadingChange = new EventEmitter<boolean>();

    public couriers : Courier[] = [];
    public loading = false;

    ngOnInit() {
        this.getCouriersData();
    }

    getCouriersData(): void {
        this.loading = true;
        this.loadingChange.emit(true);
        this.service.getCouriersDetailsPolling(30).subscribe({
        next: (data) => {
            if (data && data.length > 0) {
                this.storeCouriers(data);
                this.couriersLoaded.emit(this.couriers);
            }
            this.loading = false;
            this.loadingChange.emit(false);
            this.cdr.detectChanges();
        },
        error: (error) => {
            this.showError(error.Detail || 'Error al cargar couriers');
            this.loading = false;
            this.loadingChange.emit(false);
            this.cdr.detectChanges();
        }
        });
  }

  storeCouriers(couriers : Courier[]) : void{
    this.couriers = couriers;
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

}