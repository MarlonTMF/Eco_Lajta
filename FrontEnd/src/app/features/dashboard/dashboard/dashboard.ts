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

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (u) => this.user.set(u),
      error: (err) => console.error('Error:', err)
    });
  }
}