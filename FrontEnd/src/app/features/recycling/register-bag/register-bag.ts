import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-bag',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './register-bag.html',
  styleUrl: './register-bag.css',
})
export class RegisterBag {
  // Signals for state management
  selectedCategory = signal<string>('plastic');
  weight = signal<number>(5.0);

  setCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onSliderChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.weight.set(parseFloat(input.value));
    }
  }

  onWeightInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      let val = parseFloat(input.value);
      if (isNaN(val)) {
        return; // Allow user to type backspace/empty temporarily
      }
      if (val < 0.1) val = 0.1;
      if (val > 99.9) val = 99.9; // Generous upper limit for manual entry
      this.weight.set(parseFloat(val.toFixed(1)));
    }
  }
}
