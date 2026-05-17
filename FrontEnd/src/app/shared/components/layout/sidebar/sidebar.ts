import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() closeSidebar = new EventEmitter<void>();

  onCloseClick() {
    this.closeSidebar.emit();
  }
}
