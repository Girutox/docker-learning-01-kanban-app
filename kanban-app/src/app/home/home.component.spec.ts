import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { BoardService } from '../board.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let boardServiceMock: any;

  beforeEach(() => {
    boardServiceMock = {
      activeBoardId: {
        set: jasmine.createSpy('set')
      }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: BoardService, useValue: boardServiceMock }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  it('should set activeBoardId to null on initialization', () => {
    expect(boardServiceMock.activeBoardId.set).toHaveBeenCalledWith(null);
  });
});