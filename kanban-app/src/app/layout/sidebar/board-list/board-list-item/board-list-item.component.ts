import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BoardService } from '../../../../board.service';
import { IconBoardComponent } from "../../../../UI/SVG/icon-board/icon-board.component";

@Component({
  selector: 'app-board-list-item',
  standalone: true,
  imports: [CommonModule, RouterModule, IconBoardComponent],
  templateUrl: './board-list-item.component.html',
  styleUrl: './board-list-item.component.scss'
})
export class BoardListItemComponent {
  boardService = inject(BoardService);
  router = inject(Router);

  createNewBoard = output<void>();

  boardId = input<number>(0);
  boardName = input.required<string>();
  createMode = input<boolean>(false);

  onItemClick() {    
    this.boardService.setActiveBoardId(this.boardId());
    this.router.navigate(['/board', this.boardId()]);
  }

  onCreateNewBoard() {
    this.createNewBoard.emit();
  }
}
