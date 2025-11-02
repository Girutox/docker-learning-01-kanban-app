import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { Task } from '../../model/board.model';
import { BoardTaskComponent } from "./board-task/board-task.component";
import { BoardEmptyColumnComponent } from './board-empty-column/board-empty-column.component';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [BoardTaskComponent, BoardEmptyColumnComponent],
  templateUrl: './board-column.component.html',
  styleUrl: './board-column.component.scss'
})
export class BoardColumnComponent {
  status = input<string>();
  statusColor = input<string>();
  tasks = input<Task[]>();

  @ViewChild('circleElement') circleElement!: ElementRef;

  constructor() {
    effect(() => {
      if (this.circleElement) {
        this.circleElement.nativeElement.style.backgroundColor = this.statusColor();
      }
    });
  }
}
