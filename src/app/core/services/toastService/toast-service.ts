import { Injectable, NgZone, signal } from '@angular/core';
import { ToastMessage } from '../../models/toast-message';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  constructor(private zone: NgZone) {}

  show(type: ToastMessage['type'] = 'info', text: string, duration = 3000) {
    const id = Date.now();
    const newToast: ToastMessage = { text, type, id };
    this.toasts.update((current) => [...current, newToast]);

    setTimeout(() => this.remove(id), duration);
  }
  remove(id: number) {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
