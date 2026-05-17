import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, UserMe } from '../../../services/user';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  @Output() menuToggle = new EventEmitter<void>();
  user = signal<UserMe | null>(null);
  showLogoutModal = signal(false);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (u) => this.user.set(u),
      error: (err) => console.error('Error loading user:', err)
    });
  }

  onMenuClick() {
    this.menuToggle.emit();
  }

  confirmLogout(): void {
    this.showLogoutModal.set(true);
  }

  cancelLogout(): void {
    this.showLogoutModal.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.showLogoutModal.set(false);
    this.router.navigate(['/onboarding']);
  }
}