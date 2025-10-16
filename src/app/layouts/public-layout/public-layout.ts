import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from "../../pages/componants/navbar/navbar";
import { Footer } from "../../pages/componants/footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css']
})
export class PublicLayout {
  loaderLoading = signal(true);
  constructor() {
    setTimeout(() => {
      this.loaderLoading.set(false);
    }, 2500);
  }
}
