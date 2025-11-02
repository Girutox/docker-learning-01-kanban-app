import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { BoardService } from '../../board.service';
import { ScreenSizeService } from '../../screen-size.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ManageTaskComponent } from '../../Task/manage-task/manage-task.component';
import { ManageBoardComponent } from '../../board/manage-board/manage-board.component';
import { ConfirmationModalComponent } from '../../UI/confirmation-modal/confirmation-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let boardServiceMock: any;
  let screenSizeServiceMock: any;
  let routerMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    boardServiceMock = {
      activeBoardId: jasmine.createSpy('activeBoardId'),
      getBoardName: jasmine.createSpy('getBoardName'),
      getBoardColumns: jasmine.createSpy('getBoardColumns'),
      deleteActiveBoard: jasmine.createSpy('deleteActiveBoard')
    };

    screenSizeServiceMock = {
      resized$: of({ width: 800 }),
      mobileMediumSize: 768
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    modalServiceMock = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {}
      }),
      dismissAll: jasmine.createSpy('dismissAll'),
      componentInstance: {}
    };

    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, HttpClientModule],
      providers: [
        { provide: BoardService, useValue: boardServiceMock },
        { provide: ScreenSizeService, useValue: screenSizeServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NgbModal, useValue: modalServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on logo click', () => {
    component.onLogoClick();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should toggle floating card visibility', () => {
    component.showFloatingCard.set(false);
    component.onToggleFloatingCard();
    expect(component.showFloatingCard()).toBe(true);
  });

  it('should open add new task modal', () => {
    component.onAddNewTask();
    expect(modalServiceMock.open).toHaveBeenCalledWith(ManageTaskComponent, { centered: true });
  });

  it('should open edit board modal', () => {
    component.onEditBoard();
    expect(modalServiceMock.open).toHaveBeenCalledWith(ManageBoardComponent, { centered: true });
  });

  it('should open delete board confirmation modal', () => {
    component.onDeleteBoard();
    expect(modalServiceMock.open).toHaveBeenCalledWith(ConfirmationModalComponent, { centered: true });
  });

  it('should hide floating card', () => {
    component.showFloatingCard.set(true);
    component.onHideCard();
    expect(component.showFloatingCard()).toBe(false);
  });

  it('should toggle chevron visibility and open sidebar modal', () => {
    component.isChevronDownVisible.set(true);
    component.onChevronClick();
    expect(component.isChevronDownVisible()).toBe(false);
    expect(modalServiceMock.open).toHaveBeenCalled();
  });

  it('should display "[Choose a board]" when boardName is empty and screen size is mobile medium', () => {
    spyOn(component, 'boardName').and.returnValue('');
    spyOn(component, 'isMobileMediumSize').and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1.choose-board-mobile').textContent).toContain('[Choose a board]');
  });

  it('should display empty string when boardName is empty and screen size is not mobile medium', () => {
    spyOn(component, 'boardName').and.returnValue('');
    spyOn(component, 'isMobileMediumSize').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1.choose-board-mobile').textContent).toBe('');
  });

  it('should display the board name when boardName is not empty', () => {
    const boardName = 'Test Board';
    spyOn(component, 'boardName').and.returnValue(boardName);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toBe(boardName);
  });

  it('should display chevron down icon when screen size is mobile medium and chevron is visible', () => {
    spyOn(component, 'isMobileMediumSize').and.returnValue(true);
    spyOn(component, 'isChevronDownVisible').and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-icon-chevron-down')).toBeTruthy();
    expect(compiled.querySelector('app-icon-chevron-up')).toBeFalsy();
  });

  it('should display chevron up icon when screen size is mobile medium and chevron is not visible', () => {
    spyOn(component, 'isMobileMediumSize').and.returnValue(true);
    spyOn(component, 'isChevronDownVisible').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-icon-chevron-up')).toBeTruthy();
    expect(compiled.querySelector('app-icon-chevron-down')).toBeFalsy();
  });

  it('should not display any chevron icon when screen size is not mobile medium', () => {
    spyOn(component, 'isMobileMediumSize').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-icon-chevron-down')).toBeFalsy();
    expect(compiled.querySelector('app-icon-chevron-up')).toBeFalsy();
  });

  it('should display "+ Add New Task" when screen size is not mobile medium', () => {
    spyOn(component, 'isMobileMediumSize').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('+ Add New Task');
    expect(compiled.querySelector('app-icon-add-task-mobile')).toBeFalsy();
  });

  it('should display mobile add task icon when screen size is mobile medium', () => {
    spyOn(component, 'isMobileMediumSize').and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-icon-add-task-mobile')).toBeTruthy();
    expect(compiled.textContent).not.toContain('+ Add New Task');
  });

  it('should display the dark logo when screen size is not mobile medium and sidebar is hidden', () => {
    spyOn(component, 'sidebarHidden').and.returnValue(true);
    spyOn(component, 'isMobileMediumSize').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.logo img').src).toContain('assets/logo-dark.svg');
  });

  it('should display the mobile logo when screen size is mobile medium and sidebar is hidden', () => {
    spyOn(component, 'sidebarHidden').and.returnValue(true);
    spyOn(component, 'isMobileMediumSize').and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.logo img').src).toContain('assets/logo-mobile.svg');
  });

  it('should not display the logo when sidebar is not hidden', () => {
    spyOn(component, 'sidebarHidden').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.logo')).toBeFalsy();
  });

  it('should display the floating card section when activeBoardId is truthy and showFloatingCard is true', () => {
    boardServiceMock.activeBoardId.and.returnValue(1);
    component.showFloatingCard.set(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.menu-ellipsis')).toBeTruthy();
    expect(compiled.querySelector('app-floating-card')).toBeTruthy();
    expect(compiled.querySelector('app-floating-card .floating-card-list')).toBeTruthy();
    expect(compiled.querySelector('app-floating-card .floating-card-list .delete-option button')).toBeTruthy();
    expect(compiled.querySelector('app-floating-card .floating-card-list button')).toBeTruthy();
  });

  it('should display the floating card when showFloatingCard is true', () => {
    boardServiceMock.activeBoardId.and.returnValue(1);
    component.showFloatingCard.set(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-floating-card')).toBeTruthy();
  });

  it('should not display the floating card when showFloatingCard is false', () => {
    component.showFloatingCard.set(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-floating-card')).toBeFalsy();
  });

  it('should call onHideCard when hideCard event is emitted from floating card', () => {
    boardServiceMock.activeBoardId.and.returnValue(1);
    component.showFloatingCard.set(true);
    fixture.detectChanges();
    spyOn(component, 'onHideCard');
    const floatingCard = fixture.nativeElement.querySelector('app-floating-card');
    floatingCard.dispatchEvent(new Event('hideCard'));
    expect(component.onHideCard).toHaveBeenCalled();
  });

  it('should call onEditBoard when edit board button is clicked', () => {
    boardServiceMock.activeBoardId.and.returnValue(1);
    component.showFloatingCard.set(true);
    fixture.detectChanges();
    spyOn(component, 'onEditBoard');
    const editButton = fixture.nativeElement.querySelector('app-floating-card button');
    editButton.click();
    expect(component.onEditBoard).toHaveBeenCalled();
  });

  it('should call onDeleteBoard when delete board button is clicked', () => {
    boardServiceMock.activeBoardId.and.returnValue(1);
    component.showFloatingCard.set(true);
    fixture.detectChanges();
    spyOn(component, 'onDeleteBoard');
    const deleteButton = fixture.nativeElement.querySelector('app-floating-card .delete-option button');
    deleteButton.click();
    expect(component.onDeleteBoard).toHaveBeenCalled();
  });
});