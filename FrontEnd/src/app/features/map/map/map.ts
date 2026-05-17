import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  isDrawerOpen = signal(false);
  selectedCategory = signal<string>('all');

  categories = [
    { id: 'all', label: 'All', icon: 'layout_grid' },
    { id: 'pet', label: 'PET', color: '#51b2fe' },
    { id: 'glass', label: 'Glass', color: '#707a6c' },
    { id: 'organic', label: 'Organic', color: '#0d631b' }
  ];

  toggleDrawer(): void {
    this.isDrawerOpen.update(val => !val);
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }
}
