import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-terminal-loader',
  imports: [],
  templateUrl: './terminal-loader.component.html',
  styleUrl: './terminal-loader.component.css',
})
export class TerminalLoaderComponent {
  @Input() fileName: string = 'system.sh';
  @Input() context: string = 'module';
}
