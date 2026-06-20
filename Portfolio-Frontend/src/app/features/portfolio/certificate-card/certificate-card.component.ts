import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICertificate } from '../../../core/models/certificates.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-certificate-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './certificate-card.component.html',
  styleUrl: './certificate-card.component.css'
})
export class CertificateCardComponent {
  @Input({ required: true }) certificate!: ICertificate;

  ngOnInit(): void {
    console.log(this.certificate);
  }
}
