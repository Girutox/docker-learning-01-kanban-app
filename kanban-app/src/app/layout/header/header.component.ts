import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CustomButtonComponent } from "../../UI/custom-button/custom-button.component";
import { BoardService } from '../../board.service';
import { IconVerticalEllipsisComponent } from "../../UI/SVG/icon-vertical-ellipsis/icon-vertical-ellipsis.component";
import { FloatingCardComponent } from '../../UI/floating-card/floating-card.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageTaskComponent } from '../../Task/manage-task/manage-task.component';
import { Task } from '../../model/board.model';
import { ManageBoardComponent } from '../../board/manage-board/manage-board.component';
import { ConfirmationModalComponent } from '../../UI/confirmation-modal/confirmation-modal.component';
import { ScreenSizeService } from '../../screen-size.service';
import { IconAddTaskMobileComponent } from "../../UI/SVG/icon-add-task-mobile/icon-add-task-mobile.component";
import { IconChevronDownComponent } from "../../UI/SVG/icon-chevron-down/icon-chevron-down.component";
import { IconChevronUpComponent } from "../../UI/SVG/icon-chevron-up/icon-chevron-up.component";
import { SidebarModalComponent } from './sidebar-modal/sidebar-modal.component';
import { LoaderService } from '../../loader.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CustomButtonComponent, IconVerticalEllipsisComponent, FloatingCardComponent, IconAddTaskMobileComponent, IconChevronDownComponent, IconChevronUpComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', [
        animate('0.3s ease-in')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  boardService = inject(BoardService);
  screenSizeService = inject(ScreenSizeService);
  router = inject(Router);
  modalService = inject(NgbModal);
  loaderService = inject(LoaderService);

  sidebarHidden = input<boolean>(false);
  showFloatingCard = signal(false);

  activeBoardId = this.boardService.activeBoardId;
  boardName = computed(() => {
    return this.activeBoardId() ? this.boardService.getBoardName(this.activeBoardId()) : '';
  });
  isBoardEmpty = computed(() => {
    return (this.activeBoardId()) ? this.boardService.getBoardColumns(this.activeBoardId()).length == 0 : true;
  });

  isMobileMediumSize = signal(false);
  isChevronDownVisible = signal(true);

  ngOnInit(): void {
    this.screenSizeService.resized$.subscribe(sizes => {      
      this.isMobileMediumSize.set(sizes.width <= this.screenSizeService.mobileMediumSize);
    });
  }

  onLogoClick() {
    this.router.navigate(['/']);
  }

  onToggleFloatingCard() {
    this.showFloatingCard.set(!this.showFloatingCard());
  }

  onAddNewTask() {
    const modalRef = this.modalService.open(ManageTaskComponent, { centered: true });
    modalRef.componentInstance.isNew = signal(true);
    modalRef.componentInstance.task = signal<Task>({ id: 0, title: '', description: '', status: '', columnId: 0, subtasks: [] });
  }

  onEditBoard() {
    this.showFloatingCard.set(false);

    const modalRef = this.modalService.open(ManageBoardComponent, { centered: true });
    modalRef.componentInstance.isNew = signal(false);
    modalRef.componentInstance.id = this.activeBoardId;
  }

  onDeleteBoard() {
    this.showFloatingCard.set(false);

    const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });
    modalRef.componentInstance.title = signal('Delete this board?');
    modalRef.componentInstance.message = signal(`Are you sure you want to delete the ‘${this.boardName()}’ board? This action will remove all columns and tasks and cannot be reversed.`);
    modalRef.componentInstance.data = signal(this.boardName());
    modalRef.componentInstance.confirmedAction = signal(() => {
      this.loaderService.start();
      this.boardService.deleteActiveBoard().pipe(
        switchMap(() => this.boardService.setBoardFullData())
      ).subscribe({
        next: () => {          
          this.boardService.activeBoardId.set(null);
          this.router.navigate(['/']);
          this.loaderService.stop();
        },
        error: () => {
          this.loaderService.stop();
        }
      });
    });
  }

  onHideCard() {
    this.showFloatingCard.set(false);
  }

  onChevronClick() {
    this.isChevronDownVisible.set(!this.isChevronDownVisible());
    this.modalService.dismissAll();

    if (!this.isChevronDownVisible()) {
      this.modalService.open(SidebarModalComponent, { 
        modalDialogClass: 'sidebar-modal',
        beforeDismiss: () => {
          this.isChevronDownVisible.set(true);
          return true;
        }
      });      
    }
  }

  onTestFirebase() {
    // this.boardService.testFireBase();
  }
}
