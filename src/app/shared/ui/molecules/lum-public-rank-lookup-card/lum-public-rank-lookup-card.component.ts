import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { PublicRankStudentSuggestion } from '../../../models/public-ranking.models';

@Component({
  selector: 'app-lum-public-rank-lookup-card',
  imports: [ReactiveFormsModule],
  templateUrl: './lum-public-rank-lookup-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumPublicRankLookupCardComponent {
  readonly title = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly inputId = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly suggestions = input<readonly PublicRankStudentSuggestion[]>([]);
  readonly loadingSuggestions = input(false);
  readonly loadingRanking = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly consult = output<void>();
  readonly suggestionPick = output<string>();

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.consult.emit();
  }

  protected onPick(id: string): void {
    this.suggestionPick.emit(id);
  }
}
