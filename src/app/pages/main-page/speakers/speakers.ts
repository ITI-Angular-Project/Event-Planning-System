import Swal from 'sweetalert2';
import {
  Component,
  AfterViewInit,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-speakers',
  standalone: true,
  imports: [],
  templateUrl: './speakers.html',
  styleUrls: ['./speakers.css'],
})
export class Speakers implements AfterViewInit {
  speakers = [
    { name: 'John Doe', title: 'AI Specialist', img: 'assets/speakers/speaker1.jpg', bio: 'Expert in Artificial Intelligence with 10+ years experience.' },
    { name: 'Sarah Smith', title: 'Web Developer', img: 'assets/speakers/speaker2.jpg', bio: 'Frontend Developer specializing in Angular and React.' },
    { name: 'Mohamed Ali', title: 'Data Analyst', img: 'assets/speakers/speaker3.jpg', bio: 'Data science and predictive analytics professional.' },
    { name: 'Anna Johnson', title: 'UX Designer', img: 'assets/speakers/speaker4.jpg', bio: 'Creative UX/UI designer focusing on modern interfaces.' },
    { name: 'David Wilson', title: 'Software Engineer', img: 'assets/speakers/speaker5.jpg', bio: 'Full Stack Engineer passionate about clean code and performance.' },
    { name: 'Emma Brown', title: 'Cybersecurity Expert', img: 'assets/speakers/speaker6.jpg', bio: 'Specialist in security auditing and ethical hacking.' },
    { name: 'Omar Youssef', title: 'Cloud Architect', img: 'assets/speakers/speaker7.jpg', bio: 'Designs scalable and reliable cloud infrastructures.' },
    { name: 'Lara White', title: 'Digital Marketer', img: 'assets/speakers/speaker8.jpg', bio: 'Marketing strategist with a passion for branding.' },
  ];

  ngAfterViewInit() {
    this.handleScrollAnimation();
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.handleScrollAnimation();
  }

  private handleScrollAnimation() {
    const fadeEls = document.querySelectorAll('.fade-in');
    fadeEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('show');
      }
    });
  }

  showDetails(speaker: any) {
  const isDark = document.documentElement.classList.contains('dark'); // 👈 يتحقق من الوضع الحالي
  const bgColor = isDark ? '#0a0a0a' : '#f9f9f9';
  const textColor = isDark ? '#ffffff' : '#111111';
  const subTextColor = isDark ? '#ccc' : '#444';
  const cardBg = isDark ? '#111' : '#fff';
  const borderColor = isDark ? '#333' : '#ddd';
  const accent = '#ff0077';

  Swal.fire({
    html: `
      <div style="
        height: 80vh;
        display: flex; flex-wrap: wrap; align-items: center;
        justify-content: center; gap: 50px; padding: 40px;
        color: ${textColor}; background: transparent;
      ">
        <img src="${speaker.img}" alt="${speaker.name}"
          style="width: 320px; height: 320px; border-radius: 50%; object-fit: cover;
          box-shadow: 0 0 20px rgba(0,0,0,0.3); border: 3px solid ${accent};">

        <div style="max-width: 550px; text-align: left;">
          <h2 style="font-size: 34px; font-weight: 800; margin-bottom: 6px;">${speaker.name}</h2>
          <h4 style="font-size: 20px; color: ${accent}; margin-bottom: 16px;">${speaker.title}</h4>

          <p style="font-size: 15px; color: ${subTextColor}; line-height: 1.8; margin-bottom: 30px;">
            ${speaker.bio}
          </p>

          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 15px;">
            Sessions by ${speaker.name}
          </h3>

          <div style="display: flex; flex-wrap: wrap; gap: 25px; margin-bottom: 25px;">
            <div style="flex: 1; min-width: 200px; background: ${cardBg};
              border-radius: 10px; padding: 15px 20px; border: 1px solid ${borderColor};">
              <strong style="font-size: 16px;">Day 1</strong><br/>
              <span style="font-size: 14px; color: ${subTextColor};">10.30 - 11.30 am</span><br/>
              <span style="font-size: 15px; color: ${accent};">Marketing Matters</span>
            </div>

            <div style="flex: 1; min-width: 200px; background: ${cardBg};
              border-radius: 10px; padding: 15px 20px; border: 1px solid ${borderColor};">
              <strong style="font-size: 16px;">Day 2</strong><br/>
              <span style="font-size: 14px; color: ${subTextColor};">1.00 - 2.00 pm</span><br/>
              <span style="font-size: 15px; color: ${accent};">Creative Innovation</span>
            </div>
          </div>

          <div style="display: flex; gap: 18px; margin-top: 10px;">
            <a href="#" style="color: ${textColor};"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" style="color: ${textColor};"><i class="fa-brands fa-twitter"></i></a>
            <a href="#" style="color: ${textColor};"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="#" style="color: ${textColor};"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>
    `,
    background: bgColor,
    color: textColor,
    width: '100%',
    heightAuto: false,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      popup: 'full-screen-modal',
      closeButton: 'close-btn',
    },
    backdrop: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.6)',
  });
}

}
