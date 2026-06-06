import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'it';
    translate.use(savedLang);
  }

  get currentLang(): string {
    return this.translate.getCurrentLang();
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  closeMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show') && navbarToggler) {
      navbarToggler.click();
    }
  }
}
