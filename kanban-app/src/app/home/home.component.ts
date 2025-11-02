import { Component, inject } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  boardService = inject(BoardService);

  constructor() {
    this.boardService.activeBoardId.set(null);
  }
}
