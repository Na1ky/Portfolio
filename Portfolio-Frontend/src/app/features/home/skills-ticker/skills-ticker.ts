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
  private startXPos: number = 0;
  private currentX: number = 0;
  
  // Touch tracking
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchStartXPos: number = 0;
  private isTouchDragging: boolean = false;
  private isHorizontalSwipe: boolean | null = null; // null = non ancora determinato
  
  private autoScrollSpeed: number = 0.5; // Default slow speed

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

  private lastTime: number = 0;

  startAnimation() {
    const loop = (timestamp: number) => {
      if (!this.lastTime) this.lastTime = timestamp;
      let dt = timestamp - this.lastTime;
      // Se il tab era inattivo, evitiamo un salto enorme limitando il dt a un valore realistico (es. ~60fps)
      if (dt > 100) dt = 16.66; 
      this.lastTime = timestamp;

      if (this.tickerContainer && this.tickerContainer.nativeElement && this.track && this.track.nativeElement) {
        const track = this.track.nativeElement;
        
        const setWidth = track.scrollWidth / 2;

        if (!this.isDragging && !this.isTouchDragging) {
          // Incrementiamo in base al tempo reale (es. 0.03 pixel al millisecondo)
          const speedPerMs = 0.03; 
          this.currentX += speedPerMs * dt;
        }

        // Loop infinito
        if (this.currentX >= setWidth) {
          this.currentX -= setWidth;
        } else if (this.currentX <= 0) {
          this.currentX += setWidth;
        }

        // Applichiamo la trasformazione hardware-accelerated al track
        track.style.transform = `translate3d(-${this.currentX}px, 0, 0)`;
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
  }

  onWheel(event: WheelEvent) {
    if (this.track && this.track.nativeElement) {
      if (event.deltaY !== 0 || event.deltaX !== 0) {
        event.preventDefault(); // Previene lo scroll della pagina
        const delta = event.deltaX !== 0 ? event.deltaX : event.deltaY;
        this.currentX += delta * 0.5; // Regola la sensibilità
        
        // Assicuriamo il wrap during fast wheel scrolling
        const setWidth = this.track.nativeElement.scrollWidth / 2;
        if (this.currentX < 0) this.currentX += setWidth;
        if (this.currentX >= setWidth) this.currentX -= setWidth;
      }
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX;
    this.startXPos = this.currentX;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX;
    const walk = (x - this.startX) * 1.5; 
    this.currentX = this.startXPos - walk;
    
    // Wrap during drag
    if (this.track && this.track.nativeElement) {
      const setWidth = this.track.nativeElement.scrollWidth / 2;
      if (this.currentX < 0) this.currentX += setWidth;
      if (this.currentX >= setWidth) this.currentX -= setWidth;
    }
  }

  // -------------------------------------------------------
  // TOUCH EVENTS (supporto mobile per trascinamento ticker)
  // -------------------------------------------------------

  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartXPos = this.currentX;
    this.isTouchDragging = false;
    this.isHorizontalSwipe = null; // reset: non sappiamo ancora la direzione
  }

  onTouchMove(event: TouchEvent) {
    if (!event.touches[0]) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    // Determiniamo la direzione dello swipe al primo movimento significativo
    if (this.isHorizontalSwipe === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      this.isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    }

    // Se è uno swipe verticale, non facciamo nulla (la pagina scorrerà normalmente)
    if (this.isHorizontalSwipe === false) return;

    // Se è orizzontale, controlliamo il ticker e blocchiamo lo scroll verticale
    if (this.isHorizontalSwipe === true) {
      event.preventDefault(); // Blocca lo scroll verticale della pagina
      this.isTouchDragging = true;
      this.currentX = this.touchStartXPos - deltaX * 1.2;

      // Wrap
      if (this.track && this.track.nativeElement) {
        const setWidth = this.track.nativeElement.scrollWidth / 2;
        if (this.currentX < 0) this.currentX += setWidth;
        if (this.currentX >= setWidth) this.currentX -= setWidth;
      }
    }
  }

  onTouchEnd() {
    this.isTouchDragging = false;
    this.isHorizontalSwipe = null;
  }
}
