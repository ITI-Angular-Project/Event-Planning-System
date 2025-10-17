import { Component, signal } from '@angular/core';
import { ThemeService } from './core/services/themeService/theme-service';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/components/toast/toast";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Event-Planning-System');

  constructor(public theme: ThemeService) {}

  get themeSignal() {
    return this.theme.theme;
  }
}
