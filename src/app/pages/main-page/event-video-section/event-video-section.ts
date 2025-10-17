import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-event-video-section',
  standalone: true,
  imports: [],
  templateUrl: './event-video-section.html',
  styleUrls: ['./event-video-section.css'],
})
export class EventVideoSection implements AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  showPlayOverlay = false;

  event = {
    date: 'Oct 21',
    time: '4:00 PM UTC',
    title: 'Design Forward Summit',
    speaker: ['With Emma Price', 'Lead Product Designer at Slack'],
    buttonText: 'Join Event',
  };

  videos = [
    { id: 1, title: 'Design Systems for Scale', thumbnail: 'assets/events/speaker-1.jpg' },
    { id: 2, title: 'Systematic Design Expo', thumbnail: 'assets/events/speaker-2.jpg' },
    { id: 3, title: 'Scaleup Conference', thumbnail: 'assets/events/speaker-3.jpeg' },
    { id: 4, title: 'Creative Strategy Meetup', thumbnail: 'assets/events/speaker-4.jpeg' },
  ];

  ngAfterViewInit() {
    // تشغيل الفيديو تلقائيًا
    const video = this.heroVideo?.nativeElement;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => (this.showPlayOverlay = true));
      }
    }

    // حركة النص
    gsap.from('#hero-content', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });

    // حركة الصور عند التمرير
    gsap.to('#thumbs', {
      scrollTrigger: {
        trigger: '#thumbs',
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      y: -100,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out',
    });
  }

  tryPlay() {
    const v = this.heroVideo.nativeElement;
    v.play().then(() => (this.showPlayOverlay = false));
  }
}
