import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ThemeService } from '../../core/services/themeService/theme-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Sidebar, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  constructor(public theme: ThemeService) {}
  private initialCollapse = (() => {
    try {
      const raw = localStorage.getItem('sideBarCollabse');
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  })();
  isCollapsed = signal<boolean>(this.initialCollapse);

  toggleSidebar() {
    this.isCollapsed.update((v) => !v);
    localStorage.setItem('sideBarCollabse', JSON.stringify(this.isCollapsed()));
  }

  isMobileOpen = signal(true);

  toggleMobileSidebar() {
    this.isMobileOpen.update((v) => !v);
  }
  closeMobileSidebar() {
    this.isMobileOpen.set(false);
  }
}
