import { Component } from '@angular/core';
import { Home } from "./home/home";
import { RolesSection } from "./roles-section/roles-section";
import { EventVideoSection } from "./event-video-section/event-video-section";
import { Speakers } from "./speakers/speakers";

@Component({
  selector: 'app-main-page',
  imports: [Home, RolesSection, EventVideoSection, Speakers],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {

}
