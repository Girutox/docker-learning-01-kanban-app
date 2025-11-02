
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowSidebarComponent } from './show-sidebar.component';
import { CustomButtonComponent } from "../../../UI/custom-button/custom-button.component";
import { IconShowSidebarComponent } from '../../../UI/SVG/icon-show-sidebar/icon-show-sidebar.component';

describe('ShowSidebarComponent', () => {
  let component: ShowSidebarComponent;
  let fixture: ComponentFixture<ShowSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomButtonComponent, IconShowSidebarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit showSidebar event on button click', () => {
    spyOn(component.showSidebar, 'emit');
    component.onShowSidebar();
    expect(component.showSidebar.emit).toHaveBeenCalledWith(true);
  });
});