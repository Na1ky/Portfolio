import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class TerminalLoaderComponent {
  @Input() fileName: string = 'system.sh';
  @Input() context: string = 'module';
}
