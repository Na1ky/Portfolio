// AppComponent
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component'
import { NavbarComponent} from './components/navbar/navbar.component'
import { FooterComponent } from './components/footer/footer.component'


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
