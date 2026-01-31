import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shadow-3xl flex flex-col min-[1800px]:flex-row min-[1800px]:justify-between justify-start border-2 border-(--border) bg-(--secondary_bg) p-3 rounded-2xl shadow-lg shadow-gray-500/35">
      <div class="flex items-center gap-2 mb-2">
        <span [innerHTML]="safeIcon"></span>
        <span class="text-base sm:text-lg  min-[1800px]:text-lg text-(--secondary_text) font-bold">{{ text }}</span>
      </div>
      <span class="text-xl sm:text-2xl text-(--text) font-bold">{{ value }}</span>
    </div>
  `,
  styles: [`
    :host ::ng-deep svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--secondary_text);
    }
  `]
})
export class BoxComponent implements OnInit {
  @Input() text!: string;
  @Input() icon!: string;
  @Input() value!: any;
  
  safeIcon!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
  }
}