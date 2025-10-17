import { NgFor } from '@angular/common';
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-trusted-by-leaders',
  standalone: true,
  templateUrl: './trusted-by-leaders.html',
  imports:[FormsModule , NgFor]
})
export class TrustedByLeaders implements AfterViewInit {
  @ViewChild('logosContainer') container!: ElementRef<HTMLDivElement>;

  // Letters or brand symbols
  logos = ['W', 'R', 'M', 'S', 'X', 'G', 'B', 'P', 'T', 'N'];

  ngAfterViewInit() {
    const items = this.container.nativeElement.querySelectorAll('.logo-item');
    items.forEach((item, index) => this.animateFloating(item as HTMLElement, index));
  }

  animateFloating(el: HTMLElement, index: number) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const startX = Math.random() * screenWidth;
    const endY = screenHeight - (Math.random() * 150 + 150);
    const duration = 3 + Math.random() * 2; // Faster motion
    const delay = Math.random() * 2;

    // Random behavior: some bounce near ground, some float smoothly
    const bounce = Math.random() > 0.5;

    gsap.fromTo(
      el,
      { x: startX, y: -150, scale: 1.1, opacity: 0 },
      {
        y: endY,
        opacity: 1,
        duration,
        delay,
        ease: bounce ? 'bounce.out' : 'power2.inOut',
        repeat: -1,
        yoyo: true,
        x: startX + (Math.random() * 100 - 50),
        scale: bounce ? 1.3 : 1,
      }
    );
  }
}
