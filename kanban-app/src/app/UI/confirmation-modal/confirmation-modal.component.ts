import { Component, inject, input } from '@angular/core';
import { CustomButtonComponent } from "../custom-button/custom-button.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CustomButtonComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  modalService = inject(NgbModal);

  title = input.required<string>();
  message = input.required<string>();
  data = input<string>(); // To expand types if needed
  confirmedAction = input<any>();

  getStyledMessage(): string {
    if (typeof this.data() == 'string') {
      return this.message().replace(this.data() ?? '', `<span class='highlight'>${this.data()}</span>`);
    } else {
      return this.message();
    }
  }

  onDelete() {
    if (this.confirmedAction()) {
      this.confirmedAction()();
    }
    this.modalService.dismissAll();
  }

  onCancel() {
    this.modalService.dismissAll();
  }
}
