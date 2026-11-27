import { Component, input, numberAttribute, signal } from '@angular/core';
import { form, maxLength, required, FormRoot, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

interface PoiFormModel {
  name: string;
  description: string;
}

@Component({
  imports: [FormRoot, FormField, RouterLink],
  selector: 'app-poi-form',
  styleUrl: './poi-form.component.css',
  templateUrl: './poi-form.component.html',
})
export class PoiFormComponent {
  readonly id = input.required<number, string>({ transform: numberAttribute });

  protected readonly poiModel = signal<PoiFormModel>({
    name: '',
    description: '',
  });

  protected readonly poiForm = form(this.poiModel, (schema) => {
    required(schema.name, { message: 'Name is required' });
    maxLength(schema.name, 50, { message: 'Name can be at most 50 characters' });
    maxLength(schema.description, 200, { message: 'Description can be at most 200 characters' });
  });
}
