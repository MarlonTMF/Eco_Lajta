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

    // Safely wait for Angular's DOM painting cycle
    setTimeout(() => {
      const container = document.getElementById('googleBtnContainer');
      if (container) {
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          width: 320,
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'left'
        });
      }
    }, 50);

    // Also trigger the One Tap prompt as an automatic floating option
    google.accounts.id.prompt((notification: any) => {
      console.log('Google One Tap Notification:', notification);
    });
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