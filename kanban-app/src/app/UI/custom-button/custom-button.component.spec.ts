import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomButtonComponent } from './custom-button.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('CustomButtonComponent', () => {
  let component: CustomButtonComponent;
  let componentRef: ComponentRef<CustomButtonComponent>;
  let fixture: ComponentFixture<CustomButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomButtonComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('mode', 'primary');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create with default classes', () => {
    const button = fixture.debugElement.query(By.css('button'));

    expect(button.classes['primary-mode']).toBeTrue();
    expect(button.classes['large-size']).toBeUndefined();
    expect(button.classes['small-size']).toBeUndefined();
    expect(button.classes['disabled']).toBeUndefined();
    expect(button.attributes['type']).toBe('button');
  });

  it('should apply specified "mode" class', () => {
    componentRef.setInput('mode', 'secondary');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));

    expect(button.classes['secondary-mode']).toBeTrue();
  });

  it('should apply specified "size" class', () => {
    componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));

    expect(button.classes['large-size']).toBeTrue();
  });

  it('should apply "disabled" class when specified', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));

    expect(button.classes['disabled']).toBeTrue();
  });

  it('should set button type correctly', () => {
    componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    
    expect(button.attributes['type']).toBe('submit');
  });

  it('should emit customClick event on button click', () => {
    spyOn(component.customClick, 'emit');

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();

    expect(component.customClick.emit).toHaveBeenCalled();
  });
});
