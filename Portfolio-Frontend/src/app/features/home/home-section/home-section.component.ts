import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { SeoService } from '../../../core/services/seo.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    AboutComponent,
    TranslateModule
  ],
  templateUrl: './home-section.component.html',
  styleUrl: './home-section.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) { }

  ngOnInit() {
    this.seoService.setPageSeo({
      title: 'Dominici Nicolas | Tech Specialist & Software Engineer',
      description: 'Ciao, sono Dominici Nicolas. Scopri il mio portfolio: dallo sviluppo Full Stack alla progettazione di reti, automazione industriale e cybersecurity.',
      url: 'https://nicolas-dominici.it/',
      keywords: 'Dominici Nicolas, web developer, portfolio, frontend, Angular, projects',
      locale: 'it_IT'
    });
  }
}

