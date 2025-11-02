import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private resized = new BehaviorSubject<{ width: number, height: number}>({ width: window.innerWidth, height: window.innerHeight});
  
  resized$ = this.resized.asObservable();
  mobileMediumSize = 750;

  constructor() {
    this.getScreenSize();
    window.addEventListener('resize', this.getScreenSize.bind(this));
  }

  private getScreenSize() {
    this.resized.next({ width: window.innerWidth, height: window.innerHeight});
  }
}
