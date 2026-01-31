import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from '../../constants/icons';

export interface Courier {
    id : number,
    name : string,
    totalOrders : number
    pendingOrders : number,
    finishedOrders : number
    state : string,
    pickUpTime: string
}

@Component({
    selector: 'app-courier',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './courier.html',
})

export class CourierComponent implements OnInit {
    @Input() name!: string;
    @Input() totalOrders!: number;
    @Input() pendingOrders!: number;
    @Input() finishedOrders!: number;
    @Input() state!: string;
    @Input() icon?: string;
    @Input() pickUpTime?: string;

    safeIcon!: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {
        const iconToUse = this.icon || ICONS.truck;
        this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(iconToUse);
    }
}