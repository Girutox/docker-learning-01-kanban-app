import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CustomSelectComponent } from './custom-select.component';
import { IconChevronDownComponent } from "../SVG/icon-chevron-down/icon-chevron-down.component";
import { ComponentRef } from '@angular/core';

describe('CustomSelectComponent', () => {
  let component: CustomSelectComponent;
  let componentRef: ComponentRef<CustomSelectComponent>;
  let fixture: ComponentFixture<CustomSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, IconChevronDownComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('form', new FormGroup({
      testControl: new FormControl('')
    }));
    componentRef.setInput('options', [
      { value: '1', display: 'Option 1' },
      { value: '2', display: 'Option 2' }
    ]);
    componentRef.setInput('customFormControlName', 'testControl');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change event on selection change', () => {
    spyOn(component.customChange, 'emit');
    
    const selectElement = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    selectElement.dispatchEvent(new Event('change'));

    expect(component.customChange.emit).toHaveBeenCalled();
  });

  it('should populate the select element with options', () => {
    const selectElement = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    const options = selectElement.querySelectorAll('option');

    expect(options.length).toBe(2);
    expect(options[0].textContent).toBe('Option 1');
    expect(options[1].textContent).toBe('Option 2');
  });

  it('should set the formControlName attribute correctly', () => {
    const selectElement = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    const formControlName = selectElement.getAttribute('ng-reflect-name');

    expect(formControlName).toBe('testControl');
  });

  it('should have the correct classes on the form div', () => {
    const formDiv = fixture.nativeElement.querySelector('div.form');
    const expectedClasses = ['form', 'ng-untouched', 'ng-pristine', 'ng-valid'];

    expectedClasses.forEach(className => {
      expect(formDiv.classList).toContain(className);
    });
  });
});
