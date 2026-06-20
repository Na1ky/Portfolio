// AppComponent
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './features/ui/loading/loading.component'
import { NavbarComponent } from './features/ui/navbar/navbar.component'
import { FooterComponent } from './features/ui/footer/footer.component'


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  loading = true;

  onLoadingFinished(event: any) {
    this.loading = false;
  }
}
