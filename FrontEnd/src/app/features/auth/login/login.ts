import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  isLoading = signal(false);
  private googleInitialized = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof google !== 'undefined') {
      this.initGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (typeof google !== 'undefined') {
          this.initGoogleSignIn();
          clearInterval(interval);
        }
      }, 300);
    }
  }

  private initGoogleSignIn(): void {
    if (this.googleInitialized) return;
    this.googleInitialized = true;

    google.accounts.id.initialize({
      client_id: '437570902163-ffqiv27cft6udu4l6k4i407vfhjh71io.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    const container = document.getElementById('googleBtnContainer');
    if (container) {
      google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
      });
    }
  }



  handleCredentialResponse(response: any): void {
    this.isLoading.set(true);
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.isLoading.set(false);
        if (res.role === 'ROLE_ADMIN' || res.role === 'admin' || res.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.isLoading.set(false);
      }
    });
  }
}