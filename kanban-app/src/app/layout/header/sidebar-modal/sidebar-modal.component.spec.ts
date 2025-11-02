import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarModalComponent } from './sidebar-modal.component';
import { BoardListComponent } from "../../sidebar/board-list/board-list.component";
import { HttpClientModule } from '@angular/common/http';

describe('SidebarModalComponent', () => {
  let component: SidebarModalComponent;
  let fixture: ComponentFixture<SidebarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardListComponent, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain <app-board-list />', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-board-list')).toBeTruthy();
  });
});