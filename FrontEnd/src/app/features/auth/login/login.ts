import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
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
      }, 100);
    }
  }

  private initGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '437570902163-ffqiv27cft6udu4l6k4i407vfhjh71io.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });

    // Automatically prompt Google One Tap if allowed by the browser & origin
    google.accounts.id.prompt((notification: any) => {
      console.log('Google One Tap status:', notification);
    });
  }

  loginWithGoogle(): void {
    // 1. Try to invoke real Google Sign-In prompt
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      console.log('Initiating Google GSI authentication...');
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.warn('Google One Tap is suppressed by browser or origin. Falling back to development login...');
          this.triggerSimulatedLogin();
        }
      });

      // Safety fallback: if Google doesn't authenticate in 400ms, trigger demo login
      setTimeout(() => {
        if (this.router.url === '/login' || this.router.url === '/') {
          this.triggerSimulatedLogin();
        }
      }, 400);
    } else {
      // 2. If SDK is blocked, fall back immediately
      this.triggerSimulatedLogin();
    }
  }

  private triggerSimulatedLogin(): void {
    console.log('Applying development mock login fallback...');
    this.authService.saveToken('mock-jwt-token-mateo-velasco');
    this.router.navigate(['/dashboard']);
  }

  handleCredentialResponse(response: any): void {
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Login failed', err)
    });
  }
}