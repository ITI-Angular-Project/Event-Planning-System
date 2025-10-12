import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { ThemeService } from '../../core/services/themeService/theme-service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {
  constructor(public theme: ThemeService) {}

  get themeSignal() {
    return this.theme.theme;
  }
}
