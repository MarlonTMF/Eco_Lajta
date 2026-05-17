import { Component, signal, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Sidebar } from './shared/components/layout/sidebar/sidebar';
import { Topbar } from './shared/components/layout/topbar/topbar';
import { CommonModule } from '@angular/common';

declare var lucide: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Topbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('eco-kawsay-app');
  isSidebarActive = signal(false);
  private router = inject(Router);

  toggleSidebar() {
    this.isSidebarActive.set(!this.isSidebarActive());
  }

  showLayout() {
    const authRoutes = ['/login', '/onboarding'];
    const isAdminRoute = this.router.url.startsWith('/admin');
    return !authRoutes.includes(this.router.url) && !isAdminRoute;
  }

  ngAfterViewInit() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}
