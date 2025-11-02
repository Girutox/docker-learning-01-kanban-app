import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CustomButtonComponent } from '../../UI/custom-button/custom-button.component';
import { Board, Column } from '../../model/board.model';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconCrossComponent } from "../../UI/SVG/icon-cross/icon-cross.component";
import { CommonModule } from '@angular/common';
import { BoardService } from '../../board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../loader.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-manage-board',
  standalone: true,
  imports: [CustomButtonComponent, ReactiveFormsModule, IconCrossComponent, CommonModule],
  templateUrl: './manage-board.component.html',
  styleUrl: './manage-board.component.scss'
})
export class ManageBoardComponent implements OnInit {
  boardService = inject(BoardService);
  modalService = inject(NgbModal);
  loaderService = inject(LoaderService);

  isNew = input.required<boolean>();
  id = input<number | null>(null);
  name = signal<string>('');
  columns = signal<Column[]>([]);

  form = new FormGroup({
    boardName: new FormControl('', Validators.required),
    columns: new FormArray([])
  });

  get getColumns() {
    return this.form.controls.columns.controls;
  }

  ngOnInit(): void {
    if (this.id() != null) {
      const board: Board = this.boardService.getBoard(this.id() ?? 0);
      if (board) {
        this.name.set(board.name);
        this.columns.set(board.columns);
      }
    }

    this.form.controls.boardName.setValue(this.name());
    for (const column of this.columns()) {
      (this.form.get('columns') as FormArray).push(
        new FormGroup({
          name: new FormControl(column.name, [Validators.required])
        })
      );
    }
  }

  onAddNewColumn() {
    (this.form.get('columns') as FormArray).push(
      new FormGroup({
        name: new FormControl('', [Validators.required])
      })
    );
  }

  onRemoveColumn(index: number) {
    this.form.controls.columns.removeAt(index);
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.loaderService.start();    
    this.boardService.saveBoard(this.id(), this.form.controls.boardName.value ?? '', this.form.get('columns')?.value ?? []).pipe(
      switchMap(() => this.boardService.setBoardFullData())
    ).subscribe({
      next: () => {        
        this.modalService.dismissAll();
        this.loaderService.stop();
      },
      error: () => {
        this.modalService.dismissAll();
        this.loaderService.stop();
      }
    });    
  }
}
