import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  selectedCategory = signal<string | null>(null);
  estimatedWeight = signal<number>(5.0);
  bagsList = signal<{category: string, weight: number}[]>([]);

  constructor(private router: Router) {}

  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  addBag() {
    if (!this.selectedCategory()) return;
    this.bagsList.update(list => [...list, {
      category: this.selectedCategory()!,
      weight: this.estimatedWeight()
    }]);
    this.selectedCategory.set(null);
    this.estimatedWeight.set(5.0);
  }

  removeBag(index: number) {
    this.bagsList.update(list => list.filter((_, i) => i !== index));
  }

  confirmPickup() {
    this.router.navigate(['/pickup-confirmation'], { state: { bags: this.bagsList() } });
  }
}
