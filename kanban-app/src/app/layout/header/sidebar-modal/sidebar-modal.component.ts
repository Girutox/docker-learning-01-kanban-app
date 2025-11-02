import { Component } from '@angular/core';
import { BoardListComponent } from "../../sidebar/board-list/board-list.component";

@Component({
  selector: 'app-sidebar-modal',
  standalone: true,
  imports: [BoardListComponent],
  templateUrl: './sidebar-modal.component.html',
  styleUrl: './sidebar-modal.component.scss'
})
export class SidebarModalComponent {

}
