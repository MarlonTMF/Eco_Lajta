import { Component, signal, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Sidebar } from './shared/components/layout/sidebar/sidebar';
import { Topbar } from './shared/components/layout/topbar/topbar';

declare var lucide: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Sidebar, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('eco-kawsay-app');

  ngAfterViewInit() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}
