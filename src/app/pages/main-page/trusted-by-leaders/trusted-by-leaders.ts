import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import * as Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FormsModule } from '@angular/forms';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-trusted-by-leaders',
  standalone: true,
  templateUrl: './trusted-by-leaders.html',
  imports: [NgFor, FormsModule, NgClass],
})
export class TrustedByLeaders implements AfterViewInit {
  @ViewChild('logosContainer') container!: ElementRef<HTMLDivElement>;
  @ViewChild('centerElement') centerEl!: ElementRef<HTMLDivElement>;
  @ViewChild('sectionEl') section!: ElementRef<HTMLDivElement>;

  // 🔹 مزيج من الشعارات والحروف لجمال بصري وتنوع
  logos = [
  // 'fa-brands fa-slack',
  'fa-brands fa-wix',
  'fa-brands fa-salesforce',
  'fa-brands fa-github',
  'fa-brands fa-atlassian',
  'fa-brands fa-spotify',
  'fa-brands fa-notion',
  'fa-brands fa-figma',
  'fa-brands fa-airbnb',
  'fa-brands fa-dropbox',
  'fa-brands fa-microsoft',
  'fa-brands fa-spotify',
  'fa-brands fa-notion',
  'fa-brands fa-figma',
  'fa-brands fa-amazon',
  'fa-brands fa-dropbox',
  'fa-brands fa-microsoft',
  'fa-brands fa-twitch',
  'fa-brands fa-atlassian',
  'fa-brands fa-meta',
  'fa-brands fa-wix',
  'fa-brands fa-apple',
  'fa-brands fa-google',
  'fa-brands fa-meta',
  'fa-brands fa-linkedin',
  'fa-brands fa-airbnb',
  'fa-brands fa-amazon',
  'fa-brands fa-shopify',
  'fa-brands fa-apple',
  'fa-brands fa-paypal',
  'fa-brands fa-dropbox',
  'fa-brands fa-github',
  'fa-brands fa-apple',
  'fa-brands fa-twitch',
  'fa-brands fa-x-twitter',
  'fa-brands fa-linkedin'
];


  ngAfterViewInit() {
    const container = this.container.nativeElement;
    const centerEl = this.centerEl.nativeElement;
    const section = this.section.nativeElement;

    // تفعيل الأنيميشن عند الوصول إلى القسم
    ScrollTrigger.create({
      trigger: section,
      start: 'top 100%',
      onEnter: () => this.startPhysics(container, centerEl),
      once: true, // تشغيل مرة واحدة
    });
  }

  private startPhysics(container: HTMLElement, centerEl: HTMLElement) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // إعداد Matter.js
  const engine = Matter.Engine.create();
const world = engine.world;
// استخدم engine.gravity بدل world.gravity
engine.gravity.y = 2.3; // 👈 تسارع سقوط أسرع

    // الجدران (أسفل + جانبي)
    const wallThickness = 100;
    const walls = [
      Matter.Bodies.rectangle(
        containerWidth / 2,
        containerHeight + wallThickness / 2,
        containerWidth,
        wallThickness,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        -wallThickness / 2,
        containerHeight / 2,
        wallThickness,
        containerHeight,
        { isStatic: true }
      ),
      Matter.Bodies.rectangle(
        containerWidth + wallThickness / 2,
        containerHeight / 2,
        wallThickness,
        containerHeight,
        { isStatic: true }
      ),
    ];
    Matter.World.add(world, walls);

    // جسم مركزي لمنع الشعارات من المرور
    const centerRect = centerEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const centerX =
      centerRect.left - containerRect.left + centerEl.clientWidth / 2;
    const centerY =
      centerRect.top - containerRect.top + centerEl.clientHeight / 2;

    const centerBody = Matter.Bodies.circle(
      centerX,
      centerY,
      centerEl.clientWidth / 2 + 40,
      {
        isStatic: true,
        restitution: 1,
      }
    );
    Matter.World.add(world, centerBody);

    // الشعارات / العناصر
    const items = Array.from(
      container.querySelectorAll('.logo-item')
    ) as HTMLElement[];

    items.forEach((el) => {
      const size = 120; // حجم متوسط وواضح
      const x = Math.random() * (containerWidth - size);
      const y = Math.random() * -800 - 200;

      const body = Matter.Bodies.circle(x, y, size / 2, {
        restitution: 0.85,
        friction: 0.002,
        frictionAir: 0.02,
      });

      Matter.World.add(world, body);

      const render = () => {
        el.style.left = `${body.position.x - size / 2}px`;
        el.style.top = `${body.position.y - size / 2}px`;
        requestAnimationFrame(render);
      };
      render();
    });

    Matter.Runner.run(Matter.Runner.create(), engine);
  }
}
