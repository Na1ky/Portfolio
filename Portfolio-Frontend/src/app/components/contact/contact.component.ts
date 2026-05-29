"use strict";
import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  @Input() embedded = false;

  formData = { fullName: '', email: '', subject: '', message: '', botField: '' };
  sending = false;
  resultMessage = '';
  resultSuccess = false;
  emailError = '';

  private EMAILJS_USER_ID = 'g62lC2JYR-Ph4WY__';
  private EMAILJS_SERVICE_ID = 'service_rw7rpob';
  private EMAILJS_TEMPLATE_ID = 'template_2pt9adn';

  constructor(private cdr: ChangeDetectorRef, private seoService: SeoService) {
    emailjs.init(this.EMAILJS_USER_ID);
  }

  ngOnInit() {
    if (!this.embedded) {
      this.seoService.setPageSeo({
        title: 'Dominici Nicolas | Contatti',
        description: 'Contatta Dominici Nicolas. Trova informazioni di contatto, link social e modi per connettersi professionalmente.',
        url: 'https://nicolas-dominici.it/contact',
        keywords: 'contatti Dominici Nicolas, contatto sviluppatore web, sviluppatore freelance',
        locale: 'it_IT'
      });
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  async sendEmail() {
    if (!this.formData.fullName || !this.formData.email || !this.formData.subject || !this.formData.message) {
      this.resultSuccess = false;
      this.resultMessage = 'Per favore compila tutti i campi obbligatori.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.isValidEmail(this.formData.email)) {
      this.resultSuccess = false;
      this.resultMessage = 'Inserisci un indirizzo email valido.';
      this.emailError = 'Formato email non valido.';
      this.cdr.detectChanges();
      return;
    }

    this.emailError = '';

    if (this.formData.botField) {
      this.resultSuccess = false;
      this.resultMessage = 'Rilevato spam.';
      this.cdr.detectChanges();
      return;
    }

    this.sending = true;
    this.resultMessage = '';
    this.cdr.detectChanges();

    const templateParams = {
      from_name: this.formData.fullName,
      from_email: this.formData.email,
      subject: this.formData.subject,
      message: this.formData.message
    };

    try {
      const resp: any = await emailjs.send(this.EMAILJS_SERVICE_ID, this.EMAILJS_TEMPLATE_ID, templateParams);
      console.log('EmailJS response:', resp);

      const ok = resp && (resp.status === 200 || resp.text === 'OK' || resp.status === 'OK');

      if (ok) {
        this.resultSuccess = true;
        this.resultMessage = 'Messaggio inviato! Grazie.';
        this.formData = { fullName: '', email: '', subject: '', message: '', botField: '' };
        this.emailError = '';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.resultMessage = '';
          this.resultSuccess = false;
          this.cdr.detectChanges();
        }, 5000);
      } else {
        this.resultSuccess = false;
        this.resultMessage = 'Invio fallito, riprova più tardi.';
        this.cdr.detectChanges();
      }
    } catch (err: any) {
      console.error('EmailJS error', err);
      this.resultSuccess = false;
      this.resultMessage = err?.text || err?.message || 'Errore nell\'invio, riprova più tardi.';
      this.cdr.detectChanges();
    } finally {
      this.sending = false;
      this.cdr.detectChanges();
    }
  }
}
