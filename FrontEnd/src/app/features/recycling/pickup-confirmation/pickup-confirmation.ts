import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pickup-confirmation',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './pickup-confirmation.html',
  styleUrl: './pickup-confirmation.css',
})
export class PickupConfirmation {
  bags: {category: string, weight: number}[] = [];
  categoriesSummary = '';
  totalWeight = 0;
  totalPoints = 0;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { bags: any[] };
    if (state && state.bags && state.bags.length > 0) {
      this.bags = state.bags;
      this.totalWeight = this.bags.reduce((acc, bag) => acc + bag.weight, 0);
      this.totalPoints = this.totalWeight * 50; // Fórmula simple: 50 DP por kg
      
      const uniqueCats = Array.from(new Set(this.bags.map(b => b.category)));
      this.categoriesSummary = uniqueCats.join(', ');
    } else {
      // Fallback si entran directo por URL
      this.bags = [{category: 'Mixto', weight: 5}];
      this.categoriesSummary = 'Mixto';
      this.totalWeight = 5;
      this.totalPoints = 250;
    }
  }
}
