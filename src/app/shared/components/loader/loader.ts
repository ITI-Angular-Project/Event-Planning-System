import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  styleUrls: ['./loader.css']
})
export class Loader implements OnInit {
  loading = signal(true);

  ngOnInit() {
    // Simulate loading delay (replace with actual data load if needed)
    setTimeout(() => {
      this.loading.set(false);
    }, 2000); // 2.5s
  }
}
