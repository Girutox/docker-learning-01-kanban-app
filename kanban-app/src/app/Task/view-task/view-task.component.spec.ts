import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTaskComponent } from './view-task.component';
import { BoardService } from '../../board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../UI/custom-button/custom-button.component';
import { CustomSelectComponent } from '../../UI/custom-select/custom-select.component';
import { IconVerticalEllipsisComponent } from '../../UI/SVG/icon-vertical-ellipsis/icon-vertical-ellipsis.component';
import { FloatingCardComponent } from '../../UI/floating-card/floating-card.component';
import { ComponentRef, signal } from '@angular/core';
import { ManageTaskComponent } from '../manage-task/manage-task.component';
import { ConfirmationModalComponent } from '../../UI/confirmation-modal/confirmation-modal.component';
import { worker } from '../../../mocks/browser';
import { of } from 'rxjs';
import { LoaderService } from '../../loader.service';

describe('ViewTaskComponent', () => {
  let component: ViewTaskComponent;
  let componentRef: ComponentRef<ViewTaskComponent>;
  let fixture: ComponentFixture<ViewTaskComponent>;
  let boardService: jasmine.SpyObj<BoardService>;
  let modalServiceMock: any;

  beforeAll(async () => {
    await worker.start({
      onUnhandledRequest: 'bypass'
    });
  });

  beforeEach(async () => {
    const boardServiceSpy = jasmine.createSpyObj('BoardService', {
      getBoardColumns: jasmine.createSpy('getBoardColumns'),
      activeBoardId: jasmine.createSpy('activeBoardId'),
      deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of({})),
      saveTask: jasmine.createSpy('saveTask').and.returnValue(of({})),
      setBoardFullData: jasmine.createSpy('setBoardFullData').and.returnValue(of({}))
    });

    modalServiceMock = {
      dismissAll: jasmine.createSpy('dismissAll'),
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {}
      })
    };

    const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['start', 'stop']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        CustomButtonComponent,
        CustomSelectComponent,
        IconVerticalEllipsisComponent,
        FloatingCardComponent
      ],
      providers: [
        { provide: BoardService, useValue: boardServiceSpy },
        { provide: NgbModal, useValue: modalServiceMock },
        { provide: LoaderService, useValue: loaderServiceSpy }
      ]
    }).compileComponents();

    boardService = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('task', { title: 'Test Title', description: 'Test Description', subtasks: [{title: 'Subtask 1', isCompleted: false}] });
    boardService.getBoardColumns.and.returnValue([{ name: 'To Do', color: '', tasks: [] }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title in modal header', () => {
    fixture.detectChanges();
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.custom-modal-title');
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should toggle floating card visibility', () => {
    component.showFloatingCard = signal(true);
    fixture.detectChanges();
    const floatingCardElement: HTMLElement = fixture.nativeElement.querySelector('app-floating-card');
    expect(floatingCardElement).toBeTruthy();

    component.showFloatingCard = signal(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-floating-card')).toBeNull();
  });

  it('should call onEditTask when Edit Task button is clicked', () => {
    spyOn(component, 'onEditTask');
    component.showFloatingCard = signal(true);
    fixture.detectChanges();
    const editButton: HTMLElement = fixture.nativeElement.querySelector('.floating-card-list button');
    editButton.click();
    expect(component.onEditTask).toHaveBeenCalled();
  });

  it('should dismis all modals and open ManageTask modal when Edit button is clicked', () => {
    component.onEditTask();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
    expect(modalServiceMock.open).toHaveBeenCalledWith(ManageTaskComponent, { centered: true });
  });

  it('should dismis all modals and open Confirmation modal when Delete button is clicked', () => {
    component.onDeleteTask();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
    expect(modalServiceMock.open).toHaveBeenCalledWith(ConfirmationModalComponent, { centered: true });
  });

  it('should call onDeleteTask when Delete Task button is clicked', () => {
    spyOn(component, 'onDeleteTask');
    component.showFloatingCard = signal(true);
    fixture.detectChanges();
    const deleteButton: HTMLElement = fixture.nativeElement.querySelector('.delete-option button');
    deleteButton.click();
    expect(component.onDeleteTask).toHaveBeenCalled();
  });

  it('should display task description in modal body', () => {
    fixture.detectChanges();
    const descriptionElement: HTMLElement = fixture.nativeElement.querySelector('.task-description');
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should update subtask status on checkbox change', () => {
    fixture.detectChanges();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('.subtask-item-checkbox');

    boardService.saveTask.and.returnValue(of({}));
    boardService.setBoardFullData.and.returnValue(of({}));
    checkbox.click();
    fixture.detectChanges();
    
    expect(component.form.get('subtasks')?.value[0].isCompleted).toBe(true);
  });

  it('should change the property isCompleted when the div is clicked', () => {
    fixture.detectChanges();
    const subtaskDiv: HTMLElement = fixture.nativeElement.querySelector('.subtask-item');

    boardService.saveTask.and.returnValue(of({}));
    boardService.setBoardFullData.and.returnValue(of({}));
    subtaskDiv.click();
    fixture.detectChanges();
    
    expect(component.form.get('subtasks')?.value[0].isCompleted).toBe(true);
  });  

  it('should display correct subtasks status', () => {
    fixture.detectChanges();
    const subtasksStatusElement: HTMLElement = fixture.nativeElement.querySelector('.subtasks-status');
    const completedSubtasks = component.getCompletedSubtaskCount;
    const totalSubtasks = component.task().subtasks.length;
    expect(subtasksStatusElement.textContent).toContain(`Subtasks (${completedSubtasks} of ${totalSubtasks})`);
  });
});