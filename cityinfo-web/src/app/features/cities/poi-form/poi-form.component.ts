import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  signal,
} from '@angular/core';
import { form, maxLength, required, FormRoot, FormField, validate } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PointOfInterestService } from '../../../core/services/point-of-interest.service';
import { PointOfInterestRequest } from '../../../models/point-of-interest.model';
import { firstValueFrom } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

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
  private readonly pointOfInterestService = inject(PointOfInterestService);
  private readonly router = inject(Router);

  readonly id = input.required<number, string>({ transform: numberAttribute });
  readonly poiId = input(undefined, {
    transform: (value: string | undefined) => (value ? Number(value) : undefined),
  });

  protected readonly isEdit = computed(() => this.poiId() !== undefined);
  protected readonly poiResource = rxResource({
    params: () => {
      const poiId = this.poiId();
      return poiId === undefined ? undefined : { cityId: this.id(), poiId };
    },
    stream: ({ params }) =>
      this.pointOfInterestService.getPointOfInterest(params.cityId, params.poiId),
  });

  protected readonly poiModel = linkedSignal<PoiFormModel>(() => {
    const poi = this.poiResource.value();
    return {
      name: poi?.name ?? '',
      description: poi?.description ?? '',
    };
  });

  protected readonly poiForm = form(
    this.poiModel,
    (schema) => {
      required(schema.name, { message: 'Name is required' });
      validate(schema.name, ({ value }) => {
        if (value() !== '' && value().trim() === '') {
          return { kind: 'whitespace', message: 'Name cannot be only spaces' };
        }
        return undefined;
      });
      maxLength(schema.name, 50, { message: 'Name can be at most 50 characters' });
      maxLength(schema.description, 200, { message: 'Description can be at most 200 characters' });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();

          const request: PointOfInterestRequest = {
            name: value.name.trim(),
            description: value.description.trim() || null,
          };

          try {
            const poiId = this.poiId();

            if (poiId === undefined) {
              await firstValueFrom(
                this.pointOfInterestService.createPointOfInterest(this.id(), request),
              );
            } else {
              await firstValueFrom(
                this.pointOfInterestService.updatePointOfInterest(this.id(), poiId, request),
              );
            }

            this.router.navigate(['/cities', this.id()]);
            return;
          } catch {
            return {
              kind: 'serverError',
              message: 'Could not save the point of interest. Please try again.',
            };
          }
        },
      },
    },
  );
}
