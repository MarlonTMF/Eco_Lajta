// presentation/layout/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
})
export class AdminLayoutComponent {}
