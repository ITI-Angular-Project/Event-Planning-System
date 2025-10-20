import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  // New canonical input your templates use
  @Input() open = false;

  // Keep backward-compat: if someone binds [show], treat it as [open]
  @Input('show') set legacyShow(v: boolean) { this.open = v; }

  @Input() title?: string;
  @Input() message?: string;
  @Input() confirmText?: string;
  @Input() cancelText?: string;

  // New close output your templates use
  @Output() close = new EventEmitter<void>();

  // Keep existing outputs for other places that may still listen to them
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onOverlayClick(_event: MouseEvent) {
    // clicking the backdrop closes the modal
    this.cancel.emit();
    this.close.emit();
  }

  onClickCloseButton() {
    this.cancel.emit();
    this.close.emit();
  }

  onClickConfirm() {
    this.confirm.emit();
    this.close.emit();
  }

  onClickCancel() {
    this.cancel.emit();
    this.close.emit();
  }
}
