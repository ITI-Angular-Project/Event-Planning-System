import { Component, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DataService } from '../../../core/services/dataService/data-service';

gsap.registerPlugin(ScrollTrigger);

type UiEvent = {
  id: number;
  title: string;
  category: string;
  date: string;   // pretty label for UI (e.g., "Oct 21")
  time: string;   // pretty label for UI (e.g., "4:00 PM")
  ts: number;     // epoch ms, for sorting
  speaker?: string[];
  thumbnail?: string;
};

@Component({
  selector: 'app-event-video-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './event-video-section.html',
  styleUrls: ['./event-video-section.css'],
})
export class EventVideoSection implements AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  showPlayOverlay = false;

  /** Hero event text block (fallback if no data) */
  event: UiEvent | null = {
    date: 'Oct 21',
    time: '4:00 PM UTC',
    title: 'Design Forward Summit',
    speaker: ['With Emma Price', 'Lead Product Designer at Slack'],
    category: 'General',
    id: 0,
    thumbnail: 'assets/events/speaker-1.jpg',
    ts: new Date().getTime(),
  };

  /** Latest 4 events, each from a different category */
  featuredEvents: UiEvent[] = [];

  buttonText = 'Join Event';

  constructor(private data: DataService, private router: Router) {
    // Recompute whenever the events signal changes
    effect(() => {
      const all = this.data.events() || [];

      // Map all events to UiEvent (skip invalid dates)
      const prepared = all
        .map((e: any) => this.toUiEvent(e))
        .filter((ev): ev is UiEvent => ev != null);

      // Sort by time DESC (latest first)
      prepared.sort((a, b) => b.ts - a.ts);

      // Pick the LATEST 4 ensuring DISTINCT categories
      const seenCategories = new Set<string>();
      const picked: UiEvent[] = [];
      for (const ev of prepared) {
        const cat = (ev.category || 'General').toString();
        if (!seenCategories.has(cat)) {
          seenCategories.add(cat);
          picked.push(ev);
          if (picked.length === 4) break;
        }
      }

      this.featuredEvents = picked;

      // Set hero from the most recent of the 4 (or keep fallback)
      if (picked.length > 0) {
        const h = picked[0];
        this.event = { ...h, speaker: h.speaker ?? [] };
      }
    });
  }

  ngAfterViewInit() {
    // attempt autoplay
    const video = this.heroVideo?.nativeElement;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => (this.showPlayOverlay = true));
      }
    }

    // hero text animation
    gsap.from('#hero-content', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    });

    // thumbnails scroll-in animation
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

  goToEvent(id: number) {
    // Navigate to /events/:id (adjust if your route differs)
    this.router.navigate(['/events', id]);
  }

  // ---------- helpers ----------

  /** Convert your stored Event to UiEvent used in this section. */
  private toUiEvent(e: any): UiEvent | null {
    // Choose a reliable date source
    const dateRaw = e.startDate || e.date || e.createdAt;
    if (!dateRaw) return null;

    const dt = new Date(dateRaw);
    if (isNaN(dt.getTime())) return null;

    const category: string = e.category || e.type || 'General';

    // Best-effort speakers
    const speaker: string[] | undefined =
      Array.isArray(e.speakers) ? e.speakers :
      Array.isArray(e.speaker) ? e.speaker :
      undefined;

    const thumb: string | undefined = e.thumbnail || e.cover || e.image || undefined;

    // Pretty labels for UI
    const prettyDate = dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit' }); // e.g., "Oct 21"
    const prettyTime = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }); // e.g., "4:00 PM"

    return {
      id: Number(e.id) || 0,
      title: e.name || e.title || 'Untitled Event',
      category,
      date: prettyDate,
      time: prettyTime,
      speaker,
      thumbnail: thumb,
      ts: dt.getTime(),
    };
  }
}
