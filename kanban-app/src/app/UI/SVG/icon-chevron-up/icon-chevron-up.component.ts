import { Component, output } from '@angular/core';

@Component({
  selector: 'app-icon-chevron-up',
  standalone: true,
  imports: [],
  templateUrl: './icon-chevron-up.component.svg',
  styleUrl: './icon-chevron-up.component.scss',
  host: {
    '(click)': 'customClick.emit()'
  }
})
export class IconChevronUpComponent {
  customClick = output<void>();
}
