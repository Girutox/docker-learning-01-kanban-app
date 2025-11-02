import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageTaskComponent } from './manage-task.component';
import { BoardService } from '../../board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../UI/custom-button/custom-button.component';
import { CustomSelectComponent } from '../../UI/custom-select/custom-select.component';
import { IconCrossComponent } from "../../UI/SVG/icon-cross/icon-cross.component";
import { ComponentRef } from '@angular/core';
import {worker} from '../../../mocks/browser'
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { LoaderService } from '../../loader.service';

describe('ManageTaskComponent', () => {
  let component: ManageTaskComponent;
  let componentRef: ComponentRef<ManageTaskComponent>;
  let fixture: ComponentFixture<ManageTaskComponent>;
  let boardService: jasmine.SpyObj<BoardService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let loaderService: jasmine.SpyObj<LoaderService>;

  beforeAll(async () => {
    await worker.start({
      onUnhandledRequest: 'bypass'
    });
  });

  beforeEach(async () => {
    const boardServiceSpy = jasmine.createSpyObj('BoardService', {
      getBoardColumns: jasmine.createSpy('getBoardColumns'),
      activeBoardId: jasmine.createSpy('activeBoardId'),
      saveTask: jasmine.createSpy('saveTask').and.returnValue(of({})),
      setBoardFullData: jasmine.createSpy('setBoardFullData').and.returnValue(of({}))
    });
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['dismissAll']);
    const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['start', 'stop']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        CustomButtonComponent,
        CustomSelectComponent,
        IconCrossComponent,
        ManageTaskComponent,
        HttpClientModule
      ],
      providers: [
        { provide: BoardService, useValue: boardServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy }
      ]
    }).compileComponents();

    boardService = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    loaderService = TestBed.inject(LoaderService) as jasmine.SpyObj<LoaderService>;
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ManageTaskComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('isNew', true);
    componentRef.setInput('task', {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      subtasks: [{ title: 'Subtask 1', isCompleted: false }],
      status: 'To Do'
    });
    boardService.getBoardColumns.and.returnValue([{ name: 'To Do', color: '', tasks: [] }]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with task data', () => {
    component.ngOnInit();
    expect(component.form.controls.title.value).toBe('Test Task');
    expect(component.form.controls.description.value).toBe('Test Description');
    expect(component.form.controls.status.value).toBe('To Do');
  });

  it('should add a new subtask', () => {
    component.onAddNewSubtask();
    expect(component.form.controls.subtasks.length).toBe(2);
  });

  it('should remove a subtask', () => {
    component.onRemoveSubtask(0);
    expect(component.form.controls.subtasks.length).toBe(0);
  });

  it('should save the task', () => {
    boardService.saveTask.and.returnValue(of({}));
    boardService.setBoardFullData.and.returnValue(of({}));
    component.onSave();

    expect(loaderService.start).toHaveBeenCalled();
    expect(boardService.saveTask).toHaveBeenCalled();
    expect(modalService.dismissAll).toHaveBeenCalled();
    expect(boardService.setBoardFullData).toHaveBeenCalled();
    expect(loaderService.stop).toHaveBeenCalled();
  });

  it('should display "Add New Task" when isNew is true', () => {
    componentRef.setInput('isNew', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.custom-modal-title').textContent).toContain('Add New Task');
  });

  it('should display "Edit Task" when isNew is false', () => {
    componentRef.setInput('isNew', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.custom-modal-title').textContent).toContain('Edit Task');
  });

  it('should display "Start adding subtasks! 👇" when there are no subtasks', () => {
    component.form.controls.subtasks.clear();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Start adding subtasks! 👇');
  });

  it('should display "* Please complete all the required form values" when form is invalid and touched', () => {
    component.form.controls.title.setValue('');
    component.form.markAsTouched();
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('* Please complete all the required form values');
  });
});