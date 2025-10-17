import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home implements AfterViewInit {
  @ViewChildren('animate') elements!: QueryList<ElementRef>;

  speakers = [
    'assets/home/9.jpg',
    'assets/home/2.jpg',
    'assets/home/4.jpg',
    'assets/home/7.jpg',
    'assets/home/3.jpg',
    'assets/home/6.jpg',
    'assets/home/1.jpg',
    'assets/home/8.jpg',
    'assets/home/10.jpg',
    'assets/home/5.jpg',
  ]

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    this.elements.forEach((el) => observer.observe(el.nativeElement));
  }
}
