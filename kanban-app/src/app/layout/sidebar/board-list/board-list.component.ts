import { Component, inject, signal } from '@angular/core';
import { BoardService } from '../../../board.service';
import { BoardListItemComponent } from './board-list-item/board-list-item.component';
import { ManageBoardComponent } from "../../../board/manage-board/manage-board.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderByPipe } from "../../../UI/pipes/order-by.pipe";

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [BoardListItemComponent, OrderByPipe],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.scss'
})
export class BoardListComponent {
  boardService = inject(BoardService);
  modalService = inject(NgbModal);

  boards = this.boardService.allBoards;

  onCreateNewBoard() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ManageBoardComponent, { centered: true });
    modalRef.componentInstance.isNew = signal(true);
    modalRef.componentInstance.id = signal<number | null>(null);
  }
}
