import { Component, ElementRef, inject, OnDestroy, output, Renderer2, signal } from '@angular/core';

@Component({
  selector: 'app-floating-card',
  standalone: true,
  imports: [],
  templateUrl: './floating-card.component.html',
  styleUrl: './floating-card.component.scss'
})
export class FloatingCardComponent implements OnDestroy {
  elRef = inject(ElementRef);
  renderer = inject(Renderer2);

  hideCard = output<void>();
  counter = signal(0);
  
  clickListener: () => void;
  
  constructor() {    
    this.clickListener = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }
  
  onDocumentClick(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target) && this.counter() > 0) {
      this.hideCard.emit();
    }

    this.counter.set(this.counter() + 1);
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.clickListener();
    }
  }
}
