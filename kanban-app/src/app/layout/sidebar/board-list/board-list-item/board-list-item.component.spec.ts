import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardListItemComponent } from './board-list-item.component';
import { BoardService } from '../../../../board.service';
import { RouterTestingModule } from '@angular/router/testing';
import { IconBoardComponent } from "../../../../UI/SVG/icon-board/icon-board.component";
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

describe('BoardListItemComponent', () => {
  let component: BoardListItemComponent;
  let componentRef: ComponentRef<BoardListItemComponent>;
  let fixture: ComponentFixture<BoardListItemComponent>;
  let boardService: jasmine.SpyObj<BoardService>;

  beforeEach(async () => {
    const boardServiceSpy = jasmine.createSpyObj('BoardService', ['setActiveBoardId', 'activeBoardId']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, IconBoardComponent],
      providers: [
        { provide: BoardService, useValue: boardServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardListItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('boardName', 'Test Board');
    boardService = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setActiveBoardId and navigate on item click', () => {
    componentRef.setInput('boardId', 1);
    spyOn(component.router, 'navigate');

    fixture.detectChanges();
    const listItem = fixture.debugElement.query(By.css('li:not(.create-mode-item)'));
    listItem.triggerEventHandler('click', null);

    expect(boardService.setActiveBoardId).toHaveBeenCalledWith(1);
    expect(component.router.navigate).toHaveBeenCalledWith(['/board', 1]);
  });

  it('should emit createNewBoard on create mode item click', () => {
    spyOn(component.createNewBoard, 'emit');
    componentRef.setInput('createMode', true);

    fixture.detectChanges();
    const listItem = fixture.debugElement.query(By.css('li.create-mode-item'));
    listItem.triggerEventHandler('click', null);

    expect(component.createNewBoard.emit).toHaveBeenCalled();
  });

  it('should render the correct list item based on createMode', () => {
    componentRef.setInput('createMode', false);
    fixture.detectChanges();
    let listItem = fixture.debugElement.query(By.css('li:not(.create-mode-item)'));
    expect(listItem).toBeTruthy();

    componentRef.setInput('createMode', true);
    fixture.detectChanges();
    listItem = fixture.debugElement.query(By.css('li.create-mode-item'));
    expect(listItem).toBeTruthy();
  });
});