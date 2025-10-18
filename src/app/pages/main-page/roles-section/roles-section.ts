import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-roles-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-section.html',
  styleUrls: ['./roles-section.css'],
})
export class RolesSection implements AfterViewInit {
activeRole: any = null;
roles = [
  {
    id: 1,
    title: 'Designers',
    name: 'Creative Designers',
    topics: ['UX/UI', 'Branding', 'Prototyping'],
    description: 'Perfect for designers who want to enhance their creativity and showcase their vision through practical workshops and real projects.'
  },
  {
    id: 2,
    title: 'Developers',
    name: 'Professional Developers',
    topics: ['Frontend', 'Backend', 'DevOps'],
    description: 'Developers will gain hands-on experience with the latest technologies and improve their problem-solving skills through real challenges.'
  },
  {
    id: 3,
    title: 'Marketers',
    name: 'Digital Marketers',
    topics: ['SEO', 'Social Media', 'Brand Growth'],
    description: 'A great opportunity for marketers to understand digital trends, data-driven strategies, and audience engagement techniques.'
  },
  {
      id: 4,
      title: 'Engineers',
      name: 'Engineers',
      topics: ['Front-end', 'Back-end', 'Scalability', 'Automation'],
      description: 'Developers who bring innovation to life through code.',
    }
];

activateRole(role: any) {
  if (this.activeRole?.id === role.id) {
    this.activeRole = null; // toggle off
  } else {
    this.activeRole = role; // show this one
  }
}


  // activeRole: any = null;

  ngAfterViewInit() {
    // Entry animations for the boxes
    gsap.fromTo('.role-card',
      {

      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.roles-wrapper',
        start: 'top 85%',
      },
    } , {

      opacity: 1,
      y: 40,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.roles-wrapper',
        start: 'top 85%',
      },
    });
  }


  deactivateRole() {
    // keep activeRole (optional clear) — we'll keep selection until another hovered/clicked
    // If you want to clear on mouseleave uncomment:
    // this.activeRole = null;

    gsap.to('#blue-circle', {
      y: 20,
      scale: 0.8,
      opacity: 0,
      duration: 0.45,
      ease: 'power1.in',
    });
  }
}
