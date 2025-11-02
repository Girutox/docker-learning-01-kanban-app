import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ScreenSizeService } from './screen-size.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DestroyRef } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let screenSizeService: ScreenSizeService;
  let destroy: DestroyRef;

  beforeEach(async () => {
    screenSizeService = jasmine.createSpyObj('ScreenSizeService', ['resized$']);
    screenSizeService.resized$ = of({ width: 600, height: 600 }); // Mock observable
    screenSizeService.mobileMediumSize = 750;

    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule, HttpClientModule],
      providers: [
        { provide: ScreenSizeService, useValue: screenSizeService }
      ]
    }).compileComponents();

    destroy = TestBed.inject(DestroyRef);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should hide sidebar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onHideSidebar();
    expect(app.hideSidebar).toBeTrue();
  });

  it('should show sidebar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onShowSidebar();
    expect(app.hideSidebar).toBeFalse();
  });

  it('should check if isMobileMediumSize is true', (done: DoneFn) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();

    const subs = screenSizeService.resized$.subscribe(() => {
      expect(app.isMobileMediumSize()).toBeTrue();
      done();
    });

    destroy.onDestroy(() => subs.unsubscribe());
  });  

  it('should check if isMobileMediumSize is false', (done: DoneFn) => {
    screenSizeService.resized$ = of({ width: 800, height: 600 }); // Mock observable
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();

    const subs = screenSizeService.resized$.subscribe(() => {
      expect(app.isMobileMediumSize()).toBeFalse();
      done();
    });

    destroy.onDestroy(() => subs.unsubscribe());
  });
});