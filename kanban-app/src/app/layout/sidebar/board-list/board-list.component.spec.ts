import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardListComponent } from './board-list.component';
import { BoardService } from '../../../board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { signal } from '@angular/core';
import { ManageBoardComponent } from '../../../board/manage-board/manage-board.component';

describe('BoardListComponent', () => {
  let component: BoardListComponent;
  let fixture: ComponentFixture<BoardListComponent>;
  let boardServiceMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    boardServiceMock = {
      allBoards: signal([{ id: 1, name: 'Test Board' }]),
      activeBoardId: signal(1)
    };

    modalServiceMock = {
      dismissAll: jasmine.createSpy('dismissAll'),
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

    fixture = TestBed.createComponent(BoardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of boards', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h4').textContent).toContain('ALL BOARDS (1)');
  });

  it('should call dismissAll and open modal on create new board', () => {
    component.onCreateNewBoard();
    expect(modalServiceMock.dismissAll).toHaveBeenCalled();
    expect(modalServiceMock.open).toHaveBeenCalledWith(ManageBoardComponent, { centered: true });
  });

  it('should contain the app-board-list-item with createMode', () => {
    const compiled = fixture.nativeElement;
    const createBoardItem = compiled.querySelector('app-board-list-item[boardName="+ Create New Board"]');
    expect(createBoardItem).toBeTruthy();
  });
});