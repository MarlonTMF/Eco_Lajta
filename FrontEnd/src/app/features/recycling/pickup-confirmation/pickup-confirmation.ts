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

  saveToWallet() {
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
      localStorage.setItem('userBalance', (parseInt(savedBalance, 10) + this.totalPoints).toString());
    } else {
      localStorage.setItem('userBalance', (2450 + this.totalPoints).toString());
    }
    
    const newTx = {
      id: `tx-${Date.now()}`,
      title: 'Recolección ' + this.categoriesSummary,
      location: 'Recojo a Domicilio',
      category: 'Reciclaje',
      date: 'Hoy',
      amount: this.totalPoints,
      isPositive: true,
      icon: 'recycling',
      bgClass: 'bg-primary-fixed',
      textClass: 'text-primary'
    };
    
    const savedTxsStr = localStorage.getItem('transactions');
    if (savedTxsStr) {
      const savedTxs = JSON.parse(savedTxsStr);
      savedTxs.unshift(newTx);
      localStorage.setItem('transactions', JSON.stringify(savedTxs));
    }
    
    alert(`¡Se han añadido +${this.totalPoints} DP a tu billetera ecológica!`);
    this.router.navigate(['/my-recycling']);
  }
}
