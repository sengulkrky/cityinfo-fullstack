import { Component, input, numberAttribute } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-poi-form',
  styleUrl: './poi-form.component.css',
  templateUrl: './poi-form.component.html',
})
export class PoiFormComponent {
  readonly id = input.required<number, string>({ transform: numberAttribute });
}
