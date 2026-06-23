import { Component, OnInit, ElementRef, ViewChild, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ITechnologies } from '../../../core/models/technologies.model';

@Component({
  selector: 'app-skills-ticker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-ticker.html',
  styleUrl: './skills-ticker.css',
})
export class SkillsTicker implements OnInit, OnDestroy {
  technologies: ITechnologies[] = [];
  
  @ViewChild('tickerContainer') tickerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('track') track!: ElementRef<HTMLDivElement>;
  
  private animationFrameId: number = 0;
  private isHovered: boolean = false;
  private isDragging: boolean = false;
  private startX: number = 0;
  private scrollLeft: number = 0;
  
  private autoScrollSpeed: number = 0.5; // Default slow speed
  private accumulator: number = 0;

  constructor(
    private dataService: DataService, 
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.technologies = await this.dataService.getTechnologies();
    // Forza l'aggiornamento del DOM per rendere subito disponibile il contenitore
    this.cdr.detectChanges();
    
    if (this.technologies.length > 0) {
      // Usiamo un piccolo timeout per assicurarci che l'HTML sia stato completamente renderizzato
      setTimeout(() => {
        this.ngZone.runOutsideAngular(() => {
          this.startAnimation();
        });
      }, 50);
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  startAnimation() {
    const loop = () => {
      if (this.tickerContainer && this.tickerContainer.nativeElement && this.track && this.track.nativeElement) {
        const container = this.tickerContainer.nativeElement;
        const track = this.track.nativeElement;
        
        // L'HTML ha 2 set clonati. maxScroll è la larghezza di un set.
        const setWidth = track.scrollWidth / 2;

        if (!this.isDragging) {
          this.accumulator += this.autoScrollSpeed;
          if (this.accumulator >= 1) {
             const intPixels = Math.floor(this.accumulator);
             container.scrollLeft += intPixels;
             this.accumulator -= intPixels;
          }
        }

        // Loop infinito
        if (container.scrollLeft >= setWidth) {
          container.scrollLeft -= setWidth;
        } else if (container.scrollLeft <= 0 && (this.isHovered || this.isDragging)) {
          // Permette lo scroll infinito anche all'indietro
          container.scrollLeft += setWidth;
        }
      }
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
    this.isDragging = false;
    this.accumulator = 0;
  }

  onWheel(event: WheelEvent) {
    if (this.tickerContainer) {
      // Se si usa la rotellina verticale, la trasformiamo in orizzontale
      if (event.deltaY !== 0) {
        event.preventDefault(); // Previene lo scroll della pagina mentre si scorrono le tecnologie
        this.tickerContainer.nativeElement.scrollLeft += event.deltaY;
      }
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.tickerContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.tickerContainer.nativeElement.scrollLeft;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.tickerContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Moltiplicatore velocità trascinamento
    this.tickerContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }
}
