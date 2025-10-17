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
  roles = [
    {
      id: 1,
      title: 'Founders',
      name: 'Founders',
      topics: ['Vision', 'Growth', 'Innovation', 'Leadership'],
      description: 'Entrepreneurs leading innovative digital products.',
    },
    {
      id: 2,
      title: 'Design Leads',
      name: 'Design Leads',
      topics: ['UX Strategy', 'System Thinking', 'AI in Design', 'Design Ops'],
      description: 'Design leaders focused on scalable systems and better user experiences.',
    },
    {
      id: 3,
      title: 'Marketers',
      name: 'Marketers',
      topics: ['Brand Strategy', 'Creative Ads', 'Campaigns', 'Storytelling'],
      description: 'Marketing experts crafting meaningful brand connections.',
    },
    {
      id: 4,
      title: 'Engineers',
      name: 'Engineers',
      topics: ['Front-end', 'Back-end', 'Scalability', 'Automation'],
      description: 'Developers who bring innovation to life through code.',
    },
  ];

  activeRole: any = null;

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

  activateRole(role: any) {
    this.activeRole = role;

    // animate the blue circle (if present)
    gsap.killTweensOf('#blue-circle'); // safety
    gsap.fromTo(
      '#blue-circle',
      { y: 40, scale: 0.8, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' }
    );

    gsap.fromTo(
      '#role-info',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, delay:0 , ease: 'back.out(1.4)' }
    );
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
