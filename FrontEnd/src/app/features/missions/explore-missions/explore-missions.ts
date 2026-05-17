import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore-missions',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './explore-missions.html',
  styleUrl: './explore-missions.css',
})
export class ExploreMissions {
  activeFilter = signal<string>('Todas');

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }
}
