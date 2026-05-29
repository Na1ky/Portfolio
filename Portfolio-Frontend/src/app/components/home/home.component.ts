import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { SeoService } from '../../services/seo.service';
@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    AboutComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private seoService: SeoService) { }

  ngOnInit() {
    this.seoService.setPageSeo({
      title: 'Dominici Nicolas | About Me',
      description: 'Hi, I am Dominici Nicolas. Welcome to my personal portfolio where you can discover my skills, experience, and professional journey.',
      url: 'https://nicolas-dominici.it/',
      keywords: 'Dominici Nicolas, web developer, portfolio, frontend, Angular, projects',
      locale: 'it_IT'
    });
  }
}

