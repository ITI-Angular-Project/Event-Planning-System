import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<'light' | 'dark'>(this.loadTheme());

  constructor() {
    this.apply(this.theme());
  }

  toggle() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.apply(next);
    this.saveTheme(next);
  }

  private apply(theme: 'light' | 'dark') {
    const html = document.documentElement;
    html.classList.toggle('dark', theme === 'dark');
  }

  private loadTheme(): 'light' | 'dark' {
    const settingsRaw = localStorage.getItem('settings');
    const settings = settingsRaw ? JSON.parse(settingsRaw) : {};

    return (settings.theme as 'light' | 'dark') || 'light';
  }

  private saveTheme(theme: 'light' | 'dark') {
    const settingsRaw = localStorage.getItem('settings');
    const settings = settingsRaw ? JSON.parse(settingsRaw) : {};

    settings.theme = theme;

    localStorage.setItem('settings', JSON.stringify(settings));
  }
}
