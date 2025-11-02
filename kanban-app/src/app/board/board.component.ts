import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BoardService } from '../board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Column } from '../model/board.model';
import { CustomButtonComponent } from "../UI/custom-button/custom-button.component";
import { BoardColumnComponent } from "./board-column/board-column.component";
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageBoardComponent } from './manage-board/manage-board.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CustomButtonComponent, BoardColumnComponent, CommonModule, ManageBoardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  host: {
    '[class.start-aligned]': 'isSpecial()'
  }
})
export class BoardComponent implements OnInit {
  boardService = inject(BoardService);
  modalService = inject(NgbModal);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  boardId = signal<number>(0);
  boardColumns = computed<Column[]>(() => {    
    return JSON.parse(JSON.stringify(this.boardService.getBoardColumns(this.boardId()))) as Column[];
  });
  isSpecial = computed<boolean>(() => this.boardColumns().length > 0);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        if (params['id']) {          
          this.boardId.set(params['id']);          

          // Redirect to home if board does not exist
          if (!this.boardService.boardExists(this.boardId())) {
            this.router.navigate(['/']);
          }
        }
      }
    });
  }

  onAddNewColumn() {
    const modalRef = this.modalService.open(ManageBoardComponent, { centered: true });
    modalRef.componentInstance.isNew = signal(false);
    modalRef.componentInstance.id = this.boardId;
  }
}
