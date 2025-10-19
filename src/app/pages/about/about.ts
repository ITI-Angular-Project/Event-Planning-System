import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loader } from "../../shared/components/loader/loader";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, Loader],
  templateUrl: './about.html',
  styleUrls: []
})
export class About {
  teamMembers = [
    {
      name: 'Ahmed Alaa',
      position: 'Dashboard Developer',
      bio: 'Specializing in developing dashboards and charts',
      image:'assets/devolopers/dev1.jpg'
    },
    {
      name: 'Bassel Essam',
      position: 'UI Designer',
      bio: 'Professional UI/UX Designer with a passion for user experience',
      image:'assets/devolopers/dev2.jpg'
    },
    {
      name: 'Moaz Yasser',
      position: 'Front-end Developer',
      bio: 'Angular Application Development Specialist with 3 years of experience',
      image:'assets/devolopers/dev3.jpg'
    }
  ];
}
