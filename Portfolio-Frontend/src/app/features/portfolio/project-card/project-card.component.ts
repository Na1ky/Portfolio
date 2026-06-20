import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProject } from '../../../core/models/projects.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {

  @Input({ required: true }) project!: IProject;
  ngOnInit(): void {
    console.log(this.project);
  }
}
