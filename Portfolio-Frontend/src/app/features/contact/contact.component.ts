import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { TranslateModule } from '@ngx-translate/core';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, ContactInfoComponent, ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @Input() embedded = false;

  constructor(private seoService: SeoService) {}

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
}
