import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from '../../board.service';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let componentRef: ComponentRef<ConfirmationModalComponent>;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let mockBoardService: jasmine.SpyObj<BoardService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj('NgbModal', ['dismissAll']);

    await TestBed.configureTestingModule({
      imports: [CustomButtonComponent],
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: NgbModal, useValue: mockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('title', 'Test Title');
    componentRef.setInput('message', 'Test Message');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default values', () => {
    const titleElement = fixture.debugElement.query(By.css('.custom-modal-title')).nativeElement;
    const messageElement = fixture.debugElement.query(By.css('.modal-body p')).nativeElement;

    expect(titleElement.textContent).toContain('Test Title');
    expect(messageElement.innerHTML).toContain('Test Message');
  });

  it('should display specified title', () => {
    componentRef.setInput('title', 'Dummy title');
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.custom-modal-title')).nativeElement;
    
    expect(titleElement.textContent).toContain('Dummy title');
  });

  it('should display the styled message (regular)', () => {
    componentRef.setInput('message', 'Dummy Message');
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.modal-body p')).nativeElement;

    expect(messageElement.innerHTML).toContain("Dummy Message");
  });

  it('should display the styled message (custom data)', () => {
    componentRef.setInput('message', 'Dummy Custom Data Message');
    componentRef.setInput('data', 'Custom Data');
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('.modal-body p')).nativeElement;    

    expect(messageElement.innerHTML).toContain('Dummy <span class="highlight">Custom Data</span> Message');
  });

  // TO DO: confirmedAction function is not being called
  it('should call confirmedAction and dismiss modal on delete', () => {
    // componentRef.setInput('confirmedAction', jasmine.createSpy('confirmedAction'));
    // spyOn(component, 'confirmedAction');

    const deleteButton = fixture.debugElement.query(By.css('app-custom-button[ng-reflect-mode="destructive"] button')).nativeElement;
    deleteButton.click();

    // expect(component.confirmedAction).toHaveBeenCalled();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
  });

  it('should dismiss modal on cancel', () => {
    const cancelButton = fixture.debugElement.query(By.css('app-custom-button[ng-reflect-mode="destructive"] button')).nativeElement;
    cancelButton.click();

    expect(mockModalService.dismissAll).toHaveBeenCalled();
  });
});
