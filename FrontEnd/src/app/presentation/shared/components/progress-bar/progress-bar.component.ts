// shared/components/progress-bar/progress-bar.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="progress-container" [style.height]="height()">
      <div class="progress-fill" 
           [style.width.%]="percent()" 
           [style.background-color]="color()">
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
      background: #e2e8f0;
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.5s ease-out;
    }
  `]
})
export class ProgressBarComponent {
  percent = input.required<number>();
  color = input<string>('var(--primary)');
  height = input<string>('8px');
}
