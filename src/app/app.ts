import { Component, signal } from '@angular/core';
import { ThemeService } from './core/services/themeService/theme-service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
