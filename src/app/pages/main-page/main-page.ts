import { Component } from '@angular/core';
import { Home } from "./home/home";
import { RolesSection } from "./roles-section/roles-section";
import { EventVideoSection } from "./event-video-section/event-video-section";
import { Speakers } from "./speakers/speakers";
import { TrustedByLeaders } from "./trusted-by-leaders/trusted-by-leaders";
import { Loader } from "../../shared/components/loader/loader";


@Component({
  selector: 'app-main-page',
  imports: [Home, RolesSection, EventVideoSection, Speakers, TrustedByLeaders, Loader],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {

}
