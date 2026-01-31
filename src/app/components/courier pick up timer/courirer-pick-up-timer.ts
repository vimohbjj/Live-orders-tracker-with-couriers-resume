// courier-pick-up-timer.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { differenceInSeconds, setHours, setMinutes, setSeconds, addDays } from 'date-fns';

@Component({
  selector: 'app-courier-timer',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="font-semibold">{{ formattedTime }}</span>`
})
export class CourierTimerComponent implements OnInit, OnDestroy {
  @Input() pickUpTime: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  public formattedTime: string = 'Variable';
  private subscription!: Subscription;

  ngOnInit(): void {
    this.updateTimer();
    this.subscription = interval(1000).subscribe(() => {
      this.updateTimer();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private parsePickUpTime(timeStr: string): Date | null {
    if (!timeStr || timeStr === 'Variable') return null;

    // Si tiene formato "14-14:30", quedarse solo con la primera hora
    if (timeStr.includes('-') && !timeStr.includes('T')) {
      timeStr = timeStr.split('-')[0];
    }

    let hours: number;
    let minutes: number = 0;

    if (!timeStr.includes(':')) {
      hours = parseInt(timeStr);
      if (isNaN(hours)) return null;
    } else {
      [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return null;
    }

    let pickUpDate = setSeconds(setMinutes(setHours(new Date(), hours), minutes), 0);

    // Si la hora ya pasó, usar el día siguiente
    if (pickUpDate < new Date()) {
      pickUpDate = addDays(pickUpDate, 1);
    }

    return pickUpDate;
  }

  private updateTimer(): void {
    if (!this.pickUpTime || this.pickUpTime === 'Variable') {
      this.formattedTime = 'Variable';
      return;
    }

    const pickUpDate = this.parsePickUpTime(this.pickUpTime);

    if (!pickUpDate) {
      this.formattedTime = 'Variable';
      return;
    }

    const now = new Date();
    const diffInSecs = differenceInSeconds(pickUpDate, now);

    // Siempre será positivo porque si pasó, usamos el día siguiente
    const hours = Math.floor(diffInSecs / 3600);
    const minutes = Math.floor((diffInSecs % 3600) / 60);
    const seconds = diffInSecs % 60;

    if (hours > 0) {
      this.formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      this.formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    this.cdr.detectChanges();
  }
}