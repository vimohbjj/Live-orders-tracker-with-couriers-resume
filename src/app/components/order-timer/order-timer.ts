// timer/timer.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

export type TimerStatus = 'overdue' | 'critical' | 'warning' | 'slow' | 'ok';

@Component({
  selector: 'app-order-timer',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="font-semibold">{{ formattedTime }}</span>`
})
export class OrderTimerComponent implements OnInit, OnDestroy {

  @Input() startTime!: string;
  @Input() limitMinutes: number = 120;
  @Output() statusChange = new EventEmitter<TimerStatus>();

  public formattedTime: string = '0:00';
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

  private parseTime(timeStr: string): number {
    if (!timeStr) return NaN;

    if (timeStr.includes('-') || timeStr.includes('T')) {
      return new Date(timeStr.replace(' ', 'T')).getTime();
    }

    const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
    const today = new Date();
    today.setHours(hours, minutes, seconds, 0);
    return today.getTime();
  }

  private updateTimer(): void {
    const start = this.parseTime(this.startTime);

    if (isNaN(start)) {
      this.formattedTime = '0:00';
      this.statusChange.emit('ok');
      return;
    }

    const now = Date.now();
    const elapsedMs = now - start;
    const limitMs = this.limitMinutes * 60 * 1000;
    const remainingMs = limitMs - elapsedMs;
    const remainingMinutes = Math.floor(remainingMs / (1000 * 60));

    const totalSeconds = Math.floor(Math.abs(remainingMs) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const prefix = remainingMs < 0 ? '+' : '';
    this.formattedTime = `${prefix}${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Emitir estado en cada actualización
    this.statusChange.emit(this.getStatus(remainingMs, remainingMinutes));
  }

  private getStatus(remainingMs: number, remainingMinutes: number): TimerStatus {
    if (remainingMs < 0) 
      return 'overdue';
    if (remainingMinutes >= 0 && remainingMinutes <= 4) 
      return 'warning';
    if (remainingMinutes >= 5 && remainingMinutes <= 19) 
      return 'slow';
    return 'ok';
  }
}    