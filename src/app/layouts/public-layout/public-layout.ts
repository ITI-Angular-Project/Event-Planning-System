import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loader } from "../../pages/componants/loader/loader";
import { Navbar } from "../../pages/componants/navbar/navbar";
import { Home } from "../../pages/componants/home/home";
import { RolesSection } from "../../pages/componants/roles-section/roles-section";
import { EventVideoSection } from "../../pages/componants/event-video-section/event-video-section";
import { Speakers } from "../../pages/componants/speakers/speakers";
import { Footer } from "../../pages/componants/footer/footer";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, Loader, Navbar, Home, RolesSection, EventVideoSection, Speakers, Footer],
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
