// AppComponent
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './features/ui/loading/loading.component'
import { NavbarComponent } from './features/ui/navbar/navbar.component'
import { FooterComponent } from './features/ui/footer/footer.component'
import AOS from 'aos';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  loading = true;

  onLoadingFinished(event: any) {
    const appContainer = document.querySelector('app-navbar')?.parentElement;
    
    if (appContainer) {
      const elements = appContainer.querySelectorAll('[data-aos]');
      
      // 1. Ferma le transizioni CSS e rimuovi la classe animata
      elements.forEach((el: any) => {
        el.style.transition = 'none';
        el.classList.remove('aos-animate');
      });
      
      // 2. Forza un reflow per far applicare i cambiamenti istantaneamente
      void appContainer.offsetHeight;

      // 3. Ripristina le transizioni
      elements.forEach((el: any) => {
        el.style.transition = '';
      });
    }

    // 4. Inizia il fade-in della home page
    this.loading = false;

    // 5. Dopo il fade-in, avvia le animazioni di AOS
    setTimeout(() => {
      AOS.refreshHard();
      window.dispatchEvent(new Event('scroll'));
    }, 850);
  }
}
