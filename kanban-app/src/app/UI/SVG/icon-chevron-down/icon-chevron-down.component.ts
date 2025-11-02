import { Component, output } from '@angular/core';

@Component({
  selector: 'app-icon-chevron-down',
  standalone: true,
  imports: [],
  templateUrl: './icon-chevron-down.component.svg',
  styleUrl: './icon-chevron-down.component.scss',
  host: {
    '(click)': 'customClick.emit()'
  }
})
export class IconChevronDownComponent {
  customClick = output<void>();
}
