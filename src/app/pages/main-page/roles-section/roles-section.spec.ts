import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  circlePosition: { x: number; y: number } | null = null;
  connectorLine = { x: 0, y: 0, height: 0 };

  ngAfterViewInit() {
    // Default first active card
    setTimeout(() => {
      const first = document.querySelector('.role-card') as HTMLElement;
      if (first) this.activateRole(this.roles[0], { target: first });
    }, 200);
  }

  activateRole(role: any, event: any) {
    this.activeRole = role;

    const card = (event.target as HTMLElement).closest('.role-card') as HTMLElement;
    const wrapper = document.querySelector('.roles-wrapper') as HTMLElement;

    if (card && wrapper) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      // Center circle on card
      this.circlePosition = {
        x: cardRect.left - wrapperRect.left + cardRect.width / 2 - 90,
        y: cardRect.top - wrapperRect.top + cardRect.height / 2 - 90,
      };

      // Animate line to info box
      const container = document.querySelector('.container') as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const lineX = cardRect.left - containerRect.left + cardRect.width / 2;
      const lineY = cardRect.top - containerRect.top + cardRect.height / 2 + 90;

      this.connectorLine = {
        x: lineX,
        y: lineY,
        height: 120,
      };
    }
  }
}
