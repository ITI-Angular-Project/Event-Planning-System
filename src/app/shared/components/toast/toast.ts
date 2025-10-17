import { Component, computed } from '@angular/core';
import { ToastService } from '../../../core/services/toastService/toast-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toasts = computed(() => this.toastService.toasts());

  constructor(private toastService: ToastService) {}


  remove(id: number) {
    this.toastService.remove(id);
  }
}
