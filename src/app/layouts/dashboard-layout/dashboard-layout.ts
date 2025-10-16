import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar'; // غير الاسم
import { ThemeService } from '../../core/services/themeService/theme-service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarComponent], // غير الاسم هنا
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  constructor(public theme: ThemeService) {}
    isCollapsed = signal(JSON.parse(localStorage.getItem('sideBarCollabse')!));

  get themeSignal() {
    return this.theme.theme;
  }

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
    localStorage.setItem('sideBarCollabse', JSON.stringify(this.isCollapsed()))
  }
}
