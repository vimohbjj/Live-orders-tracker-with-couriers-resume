// clock/clock.ts
import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="customClass">{{ currentTime }}</span>`
})
export class ClockComponent implements OnInit, OnDestroy {
  @Input() showSeconds: boolean = false;
  @Input() customClass: string = 'font-semibold';

  public currentTime: string = '00:00';
  private subscription!: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateTime();
    this.subscription = interval(1000).subscribe(() => {
      this.updateTime();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateTime(): void {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    if (this.showSeconds) {
      const seconds = now.getSeconds().toString().padStart(2, '0');
      this.currentTime = `${hours}:${minutes}:${seconds}`;
    } else {
      this.currentTime = `${hours}:${minutes}`;
    }
  }
}