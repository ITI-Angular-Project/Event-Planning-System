import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { Loader } from "../../shared/components/loader/loader";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Loader],
  templateUrl: './contact.html',
  styleUrls: []
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;

    // ✅ These keys must match your EmailJS template variables exactly!
    const templateParams = {
      from_name: this.contactForm.value.name,
      from_email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
    };

    emailjs
      .send(
        'service_dmodqxg',    // 🔹 Your EmailJS Service ID
        'template_axrowbp',   // 🔹 Your EmailJS Template ID
        templateParams,
        'BLHEWScwm2GmX1gME'   // 🔹 Your Public Key
      )
      .then(() => {
        this.isSubmitting = false;
        this.contactForm.reset();

        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: '✅ Your message has been sent successfully.',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      })
      .catch((error) => {
        this.isSubmitting = false;
        console.error('EmailJS Error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '❌ Something went wrong. Please try again later.',
        });
      });
  }
}
