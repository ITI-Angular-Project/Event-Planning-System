import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.html'
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  isSubmitting = false;

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;

    // إرسال البيانات
    this.http.post('https://jsonplaceholder.typicode.com/posts', this.contactForm.value)
      .pipe(
        catchError(err => {
          alert('Error sending message. Try again later.');
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          alert('Message sent successfully!');
          this.contactForm.reset();
        }
        this.isSubmitting = false;
      });
  }
}
