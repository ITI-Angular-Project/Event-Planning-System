import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Loader } from "../../shared/components/loader/loader";
import { Navbar } from "../../shared/components/navbar/navbar";
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Loader, Navbar, Footer],
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
