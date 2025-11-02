import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Subtask, Task } from '../../model/board.model';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from '../../UI/custom-select/custom-select.component';
import { BoardService } from '../../board.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconVerticalEllipsisComponent } from "../../UI/SVG/icon-vertical-ellipsis/icon-vertical-ellipsis.component";
import { FloatingCardComponent } from "../../UI/floating-card/floating-card.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageTaskComponent } from '../manage-task/manage-task.component';
import { ConfirmationModalComponent } from '../../UI/confirmation-modal/confirmation-modal.component';
import { LoaderService } from '../../loader.service';
import { switchMap } from 'rxjs';

export interface SubtaskForm {
  title: FormControl<string>;
  isCompleted: FormControl<boolean>;
}

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [CommonModule, CustomSelectComponent, ReactiveFormsModule, IconVerticalEllipsisComponent, FloatingCardComponent],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.scss'
})
export class ViewTaskComponent implements OnInit, OnDestroy {
  boardService = inject(BoardService);
  modalService = inject(NgbModal);
  loaderService = inject(LoaderService);

  formChanged = false;

  task = input.required<Task>();
  columnName = input<string>();

  showFloatingCard = signal(false);

  form = new FormGroup({
    subtasks: new FormArray<FormGroup<SubtaskForm>>([]),
    status: new FormControl('')
  })

  get getSubtasksControls() {
    return this.form.controls.subtasks.controls;
  }

  get getCompletedSubtaskCount() {
    return this.form.controls.subtasks.value.filter(a => a.isCompleted).length;
  }

  ngOnInit(): void {
    this.task().subtasks.forEach(a => {
      (this.form.get('subtasks') as FormArray).push(new FormGroup({
        title: new FormControl(a.title, Validators.required),
        isCompleted: new FormControl(a.isCompleted, Validators.required)
      }));
    });
    this.form.controls.status.setValue(this.task().status);
  }

  onControlChange() {
    this.formChanged = true;
  }

  getStatusOptions() {
    const columns = this.boardService.getBoardColumns(this.boardService.activeBoardId());
    return columns.map(a => ({ value: a.name, display: a.name }));
  }

  onSetCheckedRow(task: FormGroup<SubtaskForm>) {
    task.controls.isCompleted.setValue(!task.controls.isCompleted.value);
    this.onControlChange();
  }

  onToggleFloatingCard() {
    this.showFloatingCard.set(!this.showFloatingCard());
  }

  onEditTask() {
    this.showFloatingCard.set(false);
    this.modalService.dismissAll();

    const modalRef = this.modalService.open(ManageTaskComponent, { centered: true });
    modalRef.componentInstance.isNew = signal(false);
    modalRef.componentInstance.task = this.task;
    modalRef.componentInstance.columnName = this.columnName;
  }

  onDeleteTask() {
    this.showFloatingCard.set(false);
    this.modalService.dismissAll();

    const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
    modalRef.componentInstance.title = signal('Delete this task?');
    modalRef.componentInstance.message = signal(`Are you sure you want to delete the ‘${this.task().title}’ task and its subtasks? This action cannot be reversed.`);
    modalRef.componentInstance.data = signal(this.task().title);
    modalRef.componentInstance.confirmedAction = signal(() => {
      this.loaderService.start();
      this.boardService.deleteTask(this.columnName() ?? '', this.task().id!).pipe(
        switchMap(() => this.boardService.setBoardFullData())
      ).subscribe({
        next: () => {
          this.loaderService.stop();
        },
        error: () => {
          this.loaderService.stop();
        }
      }
      );
    });
  }

  ngOnDestroy(): void {
    if (this.formChanged) {
      this.loaderService.start();
      this.boardService.saveTask(this.columnName() ?? '', this.task().id!, (this.form.controls.subtasks.value as Subtask[]), this.form.controls.status.value ?? '').pipe(
        switchMap(() => this.boardService.setBoardFullData())
      ).subscribe({
        next: () => {
          this.loaderService.stop();
        },
        error: () => {
          this.loaderService.stop();
        }
      });
    }
  }

  onHideCard() {
    this.showFloatingCard.set(false);
  }
}
