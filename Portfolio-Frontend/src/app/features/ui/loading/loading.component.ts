import { Component, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import AOS from 'aos';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, AfterViewInit {
  @Output() loadingfinished = new EventEmitter<void>();

  constructor(public dataService: DataService) { }

  ngAfterViewInit() {
    AOS.refreshHard();
  }

  async ngOnInit() {
    await this.waitForImagesToLoad();

    // Minimum display time + extra buffer
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.startExitAnimation();

    setTimeout(() => {
      this.loadingfinished.emit();
    }, 1200);
  }

  private waitForImagesToLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkImages = () => {
        // Wait for DOM to be ready
        if (document.readyState !== 'complete') {
          return false;
        }

        // Wait for data to be loaded from backend so images are actually rendered in DOM
        if (this.dataService && this.dataService.isLoading && this.dataService.isLoading()) {
          return false;
        }

        // Filter out lazy loaded images because they won't load until scrolled into view
        const images = Array.from(document.images).filter(img => img.loading !== 'lazy');
        const allLoaded = images.every(img => img.complete);
        return allLoaded;
      };

      if (checkImages()) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (checkImages()) {
            clearInterval(interval);
            resolve();
          }
        }, 150);
      }
    });
  }

  startExitAnimation() {
    const content = document.querySelector('.loading-content') as HTMLElement;
    const bg = document.querySelector('.loading-background') as HTMLElement;
    if (content) {
      content.classList.add('exit-animation');
    }
    if (bg) {
      bg.classList.add('exit-animation-bg');
    }
  }
}
