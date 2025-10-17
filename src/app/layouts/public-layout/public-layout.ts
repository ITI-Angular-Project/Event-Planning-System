import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Loader } from "../../shared/components/loader/loader";
import { Home } from "../../pages/main-page/home/home";
import { RolesSection } from "../../pages/main-page/roles-section/roles-section";
import { EventVideoSection } from "../../pages/main-page/event-video-section/event-video-section";
import { Speakers } from "../../pages/main-page/speakers/speakers";
import { Footer } from "../../shared/components/footer/footer";
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Loader, Navbar, Home, RolesSection, EventVideoSection, Speakers, Footer],
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css']
})
export class PublicLayout {
  loaderLoading = signal(true);
  // protected readonly title = ('day3');
  constructor() {
    setTimeout(() => {
      this.loaderLoading.set(false);
    }, 2500); // match loader delay
  }
}
