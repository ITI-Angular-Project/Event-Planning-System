import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: []
})
export class About {
  teamMembers = [
    {
      name: 'Ahmed Alaa',
      position: 'Dashboard Developer',
      bio: 'Specializing in developing dashboards and charts'
    },
    {
      name: 'Bassel Essam',
      position: 'UI Designer',
      bio: 'Professional UI/UX Designer with a passion for user experience'
    },
    {
      name: 'Moaz Yasser',
      position: 'Front-end Developer',
      bio: 'Angular Application Development Specialist with 3 years of experience'
    }
  ];
}
