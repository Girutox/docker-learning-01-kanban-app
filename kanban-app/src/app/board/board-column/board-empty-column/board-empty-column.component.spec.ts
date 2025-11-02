import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from '../../../board.service';
import { BoardEmptyColumnComponent } from './board-empty-column.component';
import { ManageBoardComponent } from "../../manage-board/manage-board.component";
import { of } from 'rxjs';
import { ComponentRef } from '@angular/core';

describe('BoardEmptyColumnComponent', () => {
  let component: BoardEmptyColumnComponent;
  let componentRef: ComponentRef<BoardEmptyColumnComponent>
  let fixture: ComponentFixture<BoardEmptyColumnComponent>;
  let boardServiceMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    boardServiceMock = {
      activeBoardId: of('test-board-id'),
      getBoardColumns: jasmine.createSpy('getBoardColumns').and.returnValue(of([]))
    };

    modalServiceMock = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {}
      })
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: BoardService, useValue: boardServiceMock },
        { provide: NgbModal, useValue: modalServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardEmptyColumnComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal when isNewColumn is true', () => {
    componentRef.setInput('isNewColumn', true);
    component.onClick();
    expect(modalServiceMock.open).toHaveBeenCalledWith(ManageBoardComponent, { centered: true });
  });

  it('should not open modal when isNewColumn is false', () => {
    componentRef.setInput('isNewColumn', false);
    component.onClick();
    expect(modalServiceMock.open).not.toHaveBeenCalled();
  });

  it('should display "+ New Column" when isNewColumn is true', () => {
    componentRef.setInput('isNewColumn', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('+ New Column');
  });

  it('should display "No tasks" when isNewColumn is false', () => {
    componentRef.setInput('isNewColumn', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('No tasks');
  });
});