import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Output() loadingfinished = new EventEmitter<void>();

  constructor() {}

  async ngOnInit() {
    await new Promise(resolve => setTimeout(resolve, 4000));

    this.startExitAnimation();

    setTimeout(() => {
      this.loadingfinished.emit();
    }, 200);
  }

  startExitAnimation() {
    const content = document.querySelector('.loading-content') as HTMLElement;
    if (content) {
      content.classList.add('exit-animation');
    }
  }
}
