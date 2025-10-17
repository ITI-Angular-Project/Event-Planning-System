import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { ThemeService } from '../../../core/services/themeService/theme-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterLink],
})
export class Navbar {
  menuOpen = false;
  isDarkMode = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
   constructor(public theme: ThemeService) {}

    get themeSignal() {
      return this.theme.theme;
    }

  // toggleTheme() {
  //   this.isDarkMode = !this.isDarkMode;
  //   const html = document.documentElement;

  //   if (this.isDarkMode) {
  //     html.classList.add('dark');
  //     // localStorage.setItem('theme', 'dark');
  //   } else {
  //     html.classList.remove('dark');
  //     // localStorage.setItem('theme', 'light');
  //   }
  // }

  // ngOnInit() {
  //   const saved = localStorage.getItem('theme');
  //   if (saved === 'dark') {
  //     this.isDarkMode = true;
  //     document.documentElement.classList.add('dark');
  //   }
  // }
}
