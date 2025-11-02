import { Component, computed, inject, input, TemplateRef, viewChild } from '@angular/core';
import { Task } from '../../../model/board.model';
import { ViewTaskComponent } from "../../../Task/view-task/view-task.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board-task',
  standalone: true,
  templateUrl: './board-task.component.html',
  styleUrl: './board-task.component.scss',
  host: {
    '(click)': 'onViewTask()'
  }
})
export class BoardTaskComponent {
  modalService = inject(NgbModal);  

  task = input.required<Task>();
  columnName = input<string>();
  viewTaskModal = viewChild<TemplateRef<any>>('viewTaskModal');

  completedSubtaskCount = computed(() => {
    return this.task().subtasks.filter(a => a.isCompleted).length;
  });

  onViewTask() {
    const modalRef = this.modalService.open(ViewTaskComponent, { centered: true });
    modalRef.componentInstance.task = this.task;
    modalRef.componentInstance.columnName = this.columnName;
  }
}
