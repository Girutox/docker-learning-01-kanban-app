import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { FloatingCardComponent } from './floating-card.component';

describe('FloatingCardComponent', () => {
  let component: FloatingCardComponent;
  let fixture: ComponentFixture<FloatingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingCardComponent],
      providers: [Renderer2]
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment counter on document click', () => {
    const initialCounter = component.counter();

    document.dispatchEvent(new Event('click'));

    expect(component.counter()).toBe(initialCounter + 1);
  });

  it('should emit hideCard if clicked outside and counter > 0', () => {
    spyOn(component.hideCard, 'emit');

    component.counter.set(1);
    document.dispatchEvent(new Event('click'));

    expect(component.hideCard.emit).toHaveBeenCalled();
  });

  it('should not emit hideCard if clicked inside', () => {
    spyOn(component.hideCard, 'emit');

    component.counter.set(1); // any value will do
    const clickEvent = new Event('click');    
    component.elRef.nativeElement.dispatchEvent(clickEvent);
    
    expect(component.hideCard.emit).not.toHaveBeenCalled();
  });
});
