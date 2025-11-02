import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { BoardService } from '../board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../UI/custom-button/custom-button.component';
import { BoardColumnComponent } from './board-column/board-column.component';
import { ManageBoardComponent } from './manage-board/manage-board.component';
import { By } from '@angular/platform-browser';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let boardServiceMock: any;
  let activatedRouteMock: any;
  let routerMock: any;
  let modalServiceMock: any;

  const dummyColumns = [{name: 'Column 1', color: 'red', tasks: []}];

  beforeEach(async () => {
    boardServiceMock = {
      getBoardColumns: jasmine.createSpy('getBoardColumns').and.returnValue(dummyColumns),
      boardExists: jasmine.createSpy('boardExists').and.returnValue(true)
    };
    modalServiceMock = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {}
      })
    };
    activatedRouteMock = {
      params: of({ id: 1 })
    };
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [CustomButtonComponent, BoardColumnComponent, CommonModule, ManageBoardComponent],
      providers: [
        { provide: BoardService, useValue: boardServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: NgbModal, useValue: modalServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;    
    fixture.detectChanges();    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set boardId on init', () => {
    expect(component.boardId()).toBe(1);
  });

  it('should set boardColumns on init', () => {
    expect(component.boardColumns()).toEqual(dummyColumns);
  });

  it('should be special if boardColumns length is greater than 0', () => {    
    expect(component.isSpecial()).toBeTrue();
  });

  // TO DO: Fix this test
  // it('should not be special if boardColumns length is 0', () => {
  //   boardServiceMock.getBoardColumns.and.returnValue([]);
  //   component.ngOnInit();
    
  //   console.log(component.boardColumns());    

  //   expect(component.isSpecial()).toBeFalse();
  // });

  it('should navigate to home if board does not exist', () => {
    boardServiceMock.boardExists.and.returnValue(false);
    component.ngOnInit();
    
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should open modal on add new column', () => {
    component.onAddNewColumn();
    expect(modalServiceMock.open).toHaveBeenCalled();
  });

  it('should render app-board-column if boardColumns length is greater than 0', () => {
    const boardColumnElements = fixture.debugElement.queryAll(By.css('app-board-column'));

    expect(boardColumnElements.length).toBe(dummyColumns.length + 1); // +1 for the add new column button
  });

  // TO DO: Fix this test
  // it('should show "+ Add New Column" button if boardColumns length is 0', () => {
  //   boardServiceMock.getBoardColumns.and.returnValue([]);
  //   component.ngOnInit();
  //   fixture.detectChanges();

  //   const addButton = fixture.debugElement.query(By.css('button')).nativeElement;
  //   expect(addButton.textContent.trim()).toBe('+ Add New Column');
  // });
});
