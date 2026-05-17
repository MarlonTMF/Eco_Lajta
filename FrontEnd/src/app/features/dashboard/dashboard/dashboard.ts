import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, UserMe } from '../../../shared/services/user';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule, RoleLabelPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user = signal<UserMe | null>(null);
  private userService = inject(UserService);

  filterPeriod = signal<'day' | 'month'>('month');

  get totalCollected() {
    return this.filterPeriod() === 'day' ? 1.5 : 48.5;
  }

  get plasticCollected() {
    return this.filterPeriod() === 'day' ? 0.8 : 24.2;
  }

  get paperCollected() {
    return this.filterPeriod() === 'day' ? 0.4 : 12.8;
  }

  get organicCollected() {
    return this.filterPeriod() === 'day' ? 0.3 : 11.5;
  }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (u) => this.user.set(u),
      error: (err) => console.error('Error:', err)
    });
  }

  setFilter(period: 'day' | 'month'): void {
    this.filterPeriod.set(period);
  }

  showTutorialInfo(): void {
    alert('¡El tutorial interactivo estará disponible en la próxima versión!');
  }
}