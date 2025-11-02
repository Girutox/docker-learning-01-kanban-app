
import { TestBed } from '@angular/core/testing';
import { ScreenSizeService } from './screen-size.service';
import { DestroyRef } from '@angular/core';

describe('ScreenSizeService', () => {
  let service: ScreenSizeService;
  let destroy: DestroyRef;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenSizeService);
    destroy = TestBed.inject(DestroyRef);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial screen size', (done: DoneFn) => {
    const initialSize = { width: window.innerWidth, height: window.innerHeight };

    const subs = service.resized$.subscribe(size => {
      expect(size).toEqual(initialSize);
      done();
    });

    destroy.onDestroy(() => subs.unsubscribe());
  });

  it('should update screen size on resize', (done: DoneFn) => {
    const newSize = { width: 800, height: 600 };
    window.innerWidth = newSize.width;
    window.innerHeight = newSize.height;
    
    window.dispatchEvent(new Event('resize'));

    const subs = service.resized$.subscribe(size => {
      expect(size).toEqual(newSize);
      done();
    });

    destroy.onDestroy(() => subs.unsubscribe());
  });

  it('should have a mobileMediumSize property', () => {
    expect(service.mobileMediumSize).toBe(750);
  });
});