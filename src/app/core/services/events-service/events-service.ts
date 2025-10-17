import { Injectable } from '@angular/core';
import { Ievents } from '../../models/ievents';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
    events: Ievents[] = [
      {
        id: 1,
        title: 'Tech Innovators Summit 2025',
        category: 'Conference',
        date: '2025-11-05',
        location: 'Cairo, Egypt',
        organizer: 'Innovation Hub',
        status: 'Upcoming',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
        description:
          'A gathering of leading tech innovators, investors, and startups discussing the future of AI and Web3.',
      },
      {
        id: 2,
        title: 'Frontend Mastery Bootcamp',
        category: 'Workshop',
        date: '2025-10-25',
        location: 'Alexandria, Egypt',
        organizer: 'Code Academy',
        status: 'Ongoing',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
        description:
          'Hands-on training for modern frontend development using Angular, React, and TailwindCSS.',
      },
      {
        id: 3,
        title: 'E-commerce Growth Strategies',
        category: 'Seminar',
        date: '2025-12-10',
        location: 'Dubai, UAE',
        organizer: 'BizWorld',
        status: 'Upcoming',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
        description:
          'Industry experts share insights on scaling online businesses and boosting digital sales performance.',
      },
      {
        id: 4,
        title: 'Tech Career Fair 2025',
        category: 'Career',
        date: '2025-11-20',
        location: 'Giza, Egypt',
        organizer: 'CareerLink',
        status: 'Upcoming',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
        description:
          'Meet top employers, attend career talks, and explore internship and job opportunities in IT.',
      },
      {
        id: 5,
        title: 'Women in Tech Meetup',
        category: 'Networking',
        date: '2025-10-28',
        location: 'Online',
        organizer: 'TechLadies Egypt',
        status: 'Ended',
        image: 'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
        description:
          'A community event celebrating women in technology — stories, mentorship, and future collaboration.',
      },
    ];
}
