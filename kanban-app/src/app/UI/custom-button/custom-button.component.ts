import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent {
  type = input<'button' | 'submit'>('button');
  mode = input.required<'primary' | 'secondary' | 'destructive'>();
  size = input<'large' | 'small'>();
  disabled = input(false);

  customClick = output<void>();

  onClick() {
    this.customClick.emit();
  }
}
