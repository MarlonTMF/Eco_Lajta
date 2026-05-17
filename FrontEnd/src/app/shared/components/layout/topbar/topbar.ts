import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService, UserMe } from '../../../services/user';

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
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (u) => this.user.set(u),
      error: (err) => console.error('Error loading user:', err)
    });
  }

  onMenuClick() {
    this.menuToggle.emit();
  }
}