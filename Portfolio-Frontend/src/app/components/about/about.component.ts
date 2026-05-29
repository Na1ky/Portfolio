import { Component, signal, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { TerminalLoaderComponent } from '../terminal-loader/terminal-loader.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [
    RouterLink,
    TerminalLoaderComponent
  ]
})
export class AboutComponent implements AfterViewInit, OnInit {
  @ViewChild('statsContainer') statsContainer!: ElementRef;

  stats = [
    { label: 'PROGETTI', icon: '💻', value: 0, displayValue: signal(0), sublabel: 'REALIZZATI' },
    { label: 'ESPERIENZA', icon: '🌐', value: 0, displayValue: signal(0), sublabel: 'ANNI' },
    { label: 'CERTIFICAZIONI', icon: '🏆', value: 0, displayValue: signal(0), sublabel: 'VALIDATI' },
  ];

  constructor(public dataService: DataService, private router: Router) { }

  async ngOnInit() {
    try {
      this.dataService.show();

      const [projectsCount, certificatesCount] = await Promise.all([
        this.dataService.getProjectsCount(),
        this.dataService.getCertificatesCount(),
      ]);

      this.stats[0].value = projectsCount ?? 0;
      this.stats[1].value = this.calculateExperienceYears();
      this.stats[2].value = certificatesCount ?? 0;

    } catch (error) {
      console.error('Errore nel recupero dei dati:', error);
    } finally {
      this.dataService.hide();

      setTimeout(() => this.initIntersectionObserver(), 100);
    }
  }

  ngAfterViewInit() {
    this.initIntersectionObserver();
  }

  initIntersectionObserver() {
    if (!this.statsContainer || this.dataService.isLoading()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateStats();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(this.statsContainer.nativeElement);
  }

  animateStats() {
    this.stats.forEach(stat => {
      let current = 0;
      const duration = 3000;
      const frameRate = 20;
      const totalFrames = duration / frameRate;
      const increment = stat.value / totalFrames;

      const interval = setInterval(() => {
        current = Math.min(current + increment, stat.value);
        stat.displayValue.set(Math.floor(current));
        if (current >= stat.value) clearInterval(interval);
      }, frameRate);
    });
  }

  calculateExperienceYears(): number {
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  }

  goToCv() {
    window.location.href = 'https://portfolio-server-green-beta.vercel.app/cv/CV_24_03_2026.pdf';
  }
}
