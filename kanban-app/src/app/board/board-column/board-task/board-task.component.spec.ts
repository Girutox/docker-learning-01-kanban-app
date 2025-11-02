import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardTaskComponent } from './board-task.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../../model/board.model';
import { ViewTaskComponent } from "../../../Task/view-task/view-task.component";
import { ComponentRef } from '@angular/core';

describe('BoardTaskComponent', () => {
  let component: BoardTaskComponent;
  let componentRef: ComponentRef<BoardTaskComponent>;
  let fixture: ComponentFixture<BoardTaskComponent>;
  let modalServiceMock: any;

  beforeEach(async () => {
    modalServiceMock = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {}
      })
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: modalServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardTaskComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal on onViewTask', () => {
    const task: Task = { id: 1, description: 'dummy', title: 'Test Task', status: 'In-Progress', subtasks: [{ title: 'Demo', isCompleted: false }] };
    componentRef.setInput('task', task);
    componentRef.setInput('columnName', 'Test Column');

    component.onViewTask();

    expect(modalServiceMock.open).toHaveBeenCalledWith(ViewTaskComponent, { centered: true });
  });

  it('should compute completedSubtaskCount correctly', () => {
    const task: Task = { id: 1, description: 'dummy', title: 'Test Task', status: 'In-Progress', subtasks: [{ title: 'Demo', isCompleted: false }, { title: 'Demo2', isCompleted: true }] };
    componentRef.setInput('task', task);

    expect(component.completedSubtaskCount()).toBe(1);
  });

  it('should render task title and subtask completion count', () => {
    const task: Task = { id: 1, description: 'dummy', title: 'Test Task', status: 'In-Progress', subtasks: [{ title: 'Demo', isCompleted: false }, { title: 'Demo2', isCompleted: true }] };
    componentRef.setInput('task', task);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Test Task');
    expect(compiled.querySelector('p').textContent).toContain('1 of 2 subtasks');
  });
});