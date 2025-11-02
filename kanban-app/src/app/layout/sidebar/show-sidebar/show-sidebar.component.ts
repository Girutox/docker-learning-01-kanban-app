import { Component, output } from '@angular/core';
import { CustomButtonComponent } from "../../../UI/custom-button/custom-button.component";
import { IconShowSidebarComponent } from '../../../UI/SVG/icon-show-sidebar/icon-show-sidebar.component';

@Component({
  selector: 'app-show-sidebar',
  standalone: true,
  imports: [CustomButtonComponent, IconShowSidebarComponent],
  templateUrl: './show-sidebar.component.html',
  styleUrl: './show-sidebar.component.scss'
})
export class ShowSidebarComponent {
  showSidebar = output<boolean>();

  onShowSidebar() {
    this.showSidebar.emit(true);
  }
}
