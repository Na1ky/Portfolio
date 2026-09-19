import { Component, OnInit } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { SeoService } from '../../../core/services/seo.service';
import { TranslateModule } from '@ngx-translate/core';
import { SkillsTicker } from '../skills-ticker/skills-ticker';

@Component({
  selector: 'app-home',
  imports: [
    AboutComponent,
    TranslateModule,
    SkillsTicker
  ],
  templateUrl: './home-section.component.html',
  styleUrl: './home-section.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) { }

  ngOnInit() {
    this.seoService.setPageSeo({
      title: 'Dominici Nicolas | Tech Specialist & Software Engineer',
      description: 'Nicolas Dominici | Full-Stack & Software Developer. Sviluppo soluzioni complete, dalle applicazioni desktop alle piattaforme web full-stack.',
      url: 'https://nicolas-dominici.it/',
      image: 'https://res.cloudinary.com/dxudggkln/image/upload/v1780684850/file_000000004874720a8694e55c8545961c_pgmefr.png',
      keywords: 'Dominici Nicolas, web developer, portfolio, frontend, Angular, projects',
      locale: 'it_IT'
    });
  }
}
