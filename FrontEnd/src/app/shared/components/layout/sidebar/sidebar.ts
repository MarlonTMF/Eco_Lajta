import { Component, Output, EventEmitter, signal, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private router = inject(Router);

  @Output() closeSidebar = new EventEmitter<void>();

  showHelp = signal(false);

  onCloseClick() {
    this.closeSidebar.emit();
  }

  openHelp() {
    this.showHelp.set(true);
  }

  closeHelp() {
    this.showHelp.set(false);
  }

  logout() {
    // Limpiar tokens y redirigir al login
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
