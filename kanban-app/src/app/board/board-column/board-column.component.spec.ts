import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardColumnComponent } from './board-column.component';
import { BoardTaskComponent } from './board-task/board-task.component';
import { BoardEmptyColumnComponent } from './board-empty-column/board-empty-column.component';
import { ComponentRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('BoardColumnComponent', () => {
  let component: BoardColumnComponent;
  let componentRef: ComponentRef<BoardColumnComponent>;
  let fixture: ComponentFixture<BoardColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardTaskComponent, BoardEmptyColumnComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardColumnComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('status', 'In Progress');
    componentRef.setInput('statusColor', 'blue');
    componentRef.setInput('tasks', [{ id: 1, title: 'Test Task', description: 'Description', status: 'In Progress', subtasks: [] }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should not display the circle element when status is undefined', () => {
    componentRef.setInput('status', undefined);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.circle')).toBeFalsy();
  });

  it('should set circle background color based on statusColor', () => {
    expect(component.circleElement.nativeElement.style.backgroundColor).toBe('blue');
  });

  it('should display the correct status and task count', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('In Progress (1)');
  });

  it('should display tasks when tasks are present', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-board-task')).toBeTruthy();
  });

  it('should display empty column component when no tasks are present', () => {
    componentRef.setInput('tasks', []);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-board-empty-column')).toBeTruthy();
  });
});
