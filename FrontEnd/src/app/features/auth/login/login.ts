import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  showFallbackButton = signal(true);
  isLoading = signal(false);
  errorMsg  = signal<string | null>(null);

  email    = '';
  password = '';

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
    try {
      google.accounts.id.initialize({
        client_id: '437570902163-ffqiv27cft6udu4l6k4i407vfhjh71io.apps.googleusercontent.com',
        callback: (response: any) => this.handleCredentialResponse(response)
      });
      const container = document.getElementById('googleBtnContainer');
      if (container) {
        google.accounts.id.renderButton(container, {
          theme: 'outline', size: 'large', width: 320,
          shape: 'pill', text: 'continue_with', logo_alignment: 'left'
        });
        this.showFallbackButton.set(false);
      }
    } catch (err) {
      this.showFallbackButton.set(true);
    }
  }

  // Login con email + contraseña (mock: acepta cualquier correo + mínimo 6 chars)
  loginWithEmail(): void {
    this.errorMsg.set(null);
    if (!this.email || !this.password) {
      this.errorMsg.set('Completa todos los campos para continuar.');
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.saveToken('mock-jwt-token-mateo-velasco');
      this.router.navigate(['/dashboard']);
      this.isLoading.set(false);
    }, 900);
  }

  loginWithGoogleMock(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.saveToken('mock-jwt-token-mateo-velasco');
      this.router.navigate(['/dashboard']);
      this.isLoading.set(false);
    }, 1200);
  }

  handleCredentialResponse(response: any): void {
    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => { this.loginWithGoogleMock(); }
    });
  }
}