import { Component, signal } from '@angular/core';
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
  counter = signal(0);
  target = 5000;
  duration = 5000; // in ms

  ngOnInit() {
    this.animateCounter();
  }

 animateCounter() {
    const stepTime = 10; // update every 10ms
    const increment = this.target / (this.duration / stepTime);
    const timer = setInterval(() => {
      const nextValue = this.counter() + increment;
      if (nextValue >= this.target) {
        this.counter.set(this.target);
        clearInterval(timer);
      } else {
        this.counter.set(nextValue);
      }
    }, stepTime);}
}
