import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from 'emailjs-com';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  formData = { fullName: '', email: '', subject: '', message: '', botField: '' };
  sending = false;
  resultMessage = '';
  resultSuccess = false;
  emailError = '';

  private EMAILJS_USER_ID = 'g62lC2JYR-Ph4WY__';
  private EMAILJS_SERVICE_ID = 'service_rw7rpob';
  private EMAILJS_TEMPLATE_ID = 'template_2pt9adn';

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    emailjs.init(this.EMAILJS_USER_ID);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  async sendEmail() {
    if (!this.formData.fullName || !this.formData.email || !this.formData.subject || !this.formData.message) {
      this.resultSuccess = false;
      this.resultMessage = this.translate.instant('CONTACT.MESSAGES.REQUIRED');
      this.cdr.detectChanges();
      return;
    }

    if (!this.isValidEmail(this.formData.email)) {
      this.resultSuccess = false;
      this.resultMessage = this.translate.instant('CONTACT.MESSAGES.INVALID_EMAIL');
      this.emailError = this.translate.instant('CONTACT.MESSAGES.INVALID_EMAIL_FORMAT');
      this.cdr.detectChanges();
      return;
    }

    this.emailError = '';

    if (this.formData.botField) {
      this.resultSuccess = false;
      this.resultMessage = this.translate.instant('CONTACT.MESSAGES.SPAM');
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
      
      const ok = resp && (resp.status === 200 || resp.text === 'OK' || resp.status === 'OK');

      if (ok) {
        this.resultSuccess = true;
        this.resultMessage = this.translate.instant('CONTACT.MESSAGES.SUCCESS');
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
        this.resultMessage = this.translate.instant('CONTACT.MESSAGES.FAILED');
        this.cdr.detectChanges();
      }
    } catch (err: any) {
      this.resultSuccess = false;
      this.resultMessage = err?.text || err?.message || this.translate.instant('CONTACT.MESSAGES.ERROR');
      this.cdr.detectChanges();
    } finally {
      this.sending = false;
      this.cdr.detectChanges();
    }
  }
}
