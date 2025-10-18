import { Component } from '@angular/core';
import { Home } from "./home/home";
import { RolesSection } from "./roles-section/roles-section";
import { EventVideoSection } from "./event-video-section/event-video-section";
import { Speakers } from "./speakers/speakers";
import { TrustedByLeaders } from "./trusted-by-leaders/trusted-by-leaders";

@Component({
  selector: 'app-main-page',
  imports: [Home, RolesSection, EventVideoSection, Speakers, TrustedByLeaders],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {

}
