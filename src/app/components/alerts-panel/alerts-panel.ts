// alerts-panel/alerts-panel.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServiceService } from '../../Service/services.services';
import Swal from 'sweetalert2';
import { ICONS } from '../../constants/icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { formatDate } from 'date-fns';

export interface AlertData {
  pendingOrdersFromPastDays: number;
}

@Component({
  selector: 'app-alerts-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-panel.html',
  styleUrl: './alerts-panel.css'
})

export class AlertsPanelComponent implements OnInit {

  constructor(
    private service: ServiceService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}
  
  safeIcon!: SafeHtml;

  public pendingOrdersFromPastDays : number | undefined;

  ngOnInit(): void {
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(ICONS.alert);
    this.getData();
  }

  getData() : void {
    this.service.getPendingOrdersFromPastDaysPolling(120, 7).subscribe({
        next: (data) => {
            this.storeData(data);
            this.cdr.detectChanges();
        },
        error: (error) => {
            this.errorMessage(error.Details);
            this.cdr.detectChanges();
        }  
    })
  }

  storeData(data : number) : void {;
    this.pendingOrdersFromPastDays = data;
  }

    errorMessage(message : string) : void {
        Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        });
    }
}