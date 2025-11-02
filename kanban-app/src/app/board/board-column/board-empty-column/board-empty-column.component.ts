import { Component, computed, inject, input, signal } from '@angular/core';
import { ManageBoardComponent } from "../../manage-board/manage-board.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from '../../../board.service';

@Component({
  selector: 'app-board-empty-column',
  standalone: true,
  templateUrl: './board-empty-column.component.html',
  styleUrl: './board-empty-column.component.scss',
  host: {
    '(click)': 'onClick()',
    '[class.new-column]': 'isNewColumn()'
  }
})
export class BoardEmptyColumnComponent {
  isNewColumn = input<boolean>(true);
  boardService = inject(BoardService);
  modalService = inject(NgbModal);

  boardId = this.boardService.activeBoardId;
  boardColumns = computed(() => {
    return this.boardService.getBoardColumns(this.boardId());
  });

  onClick() {
    if (this.isNewColumn()) {
      const modalRef = this.modalService.open(ManageBoardComponent, { centered: true });
      modalRef.componentInstance.isNew = signal(false);
      modalRef.componentInstance.id = this.boardId;      
    }
  }
}
