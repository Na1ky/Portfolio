import { Component, Input } from '@angular/core';

import { ITechnologies } from '../../../core/models/technologies.model';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-tech-stack-card',
  standalone: true,
  imports: [],
  templateUrl: './tech-stack-card.component.html',
  styleUrl: './tech-stack-card.component.css'
})
export class TechnologiesCardComponent {

  @Input({ required: true }) Technologies!: ITechnologies;

}
