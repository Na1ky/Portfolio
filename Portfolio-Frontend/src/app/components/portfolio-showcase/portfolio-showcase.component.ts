import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { DataService } from '../../services/data.service';
import { IProject } from '../../data/projects';
import { ICertificate } from '../../data/certificates';
import { CertificateCardComponent } from '../certificate-card/certificate-card.component';
import { ICategory, ITechnologies } from '../../data/Technologies';
import { TechnologiesCardComponent } from '../tech-stack-card/tech-stack-card.component';
import { TerminalLoaderComponent } from '../terminal-loader/terminal-loader.component';
import { SeoService } from '../../services/seo.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-portfolio-showcase',
  standalone: true,
  imports: [
    ProjectCardComponent,
    CertificateCardComponent,
    TechnologiesCardComponent,
    TerminalLoaderComponent,
    TranslateModule
  ],
  templateUrl: './portfolio-showcase.component.html',
  styleUrls: ['./portfolio-showcase.component.css']
})
export class PortfolioShowcaseComponent implements OnInit {
  @Input() embedded = false;

  activeTab: 'projects' | 'certificates' | 'Technologies' = 'projects';

  projects: IProject[] = [];
  certificates: ICertificate[] = [];
  Technologies: ITechnologies[] = [];
  categories: ICategory[] = [];

  constructor(
    public dataService: DataService,
    private cdr: ChangeDetectorRef,
    private seoService: SeoService
  ) { }

  async ngOnInit() {
    if (!this.embedded) {
      this.seoService.setPageSeo({
        title: 'Dominici Nicolas | Portfolio',
        description: 'Check out my projects, certifications, and the technologies I work with. Explore examples of my professional work and achievements.',
        url: 'https://nicolas-dominici.it/portfolio',
        keywords: 'portfolio projects, certifications, tech stack, angular developer, web development',
        locale: 'it_IT'
      });
    }
    this.dataService.show();

    try {
      const [resProjects, resCertificates, resTech, resCategories] = await Promise.all([
        this.dataService.getProjects(),
        this.dataService.getCertificates(),
        this.dataService.getTechnologies(),
        this.dataService.getCategories()
      ]);

      this.projects = resProjects;
      this.certificates = resCertificates;
      this.Technologies = resTech;
      this.categories = resCategories;

      console.log(this.certificates, this.categories);

    } catch (error) {
      console.error('Errore nel recupero dei dati:', error);
    } finally {
      this.dataService.hide();
      this.cdr.detectChanges();
    }
  }

  setActiveTab(tab: 'projects' | 'certificates' | 'Technologies'): void {
    this.activeTab = tab;
  }
}
