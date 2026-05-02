import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LumNeoFieldLabelComponent } from '../lum-neo-field-label/lum-neo-field-label.component';
import { LumIconComponent } from '../../atoms/lum-icon/lum-icon.component';

export interface LumMultiSearchPickOption {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'app-lum-neo-multi-search-pick',
  imports: [LumNeoFieldLabelComponent, LumIconComponent],
  templateUrl: './lum-neo-multi-search-pick.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LumNeoMultiSearchPickComponent {
  readonly label = input.required<string>();
  readonly options = input.required<readonly LumMultiSearchPickOption[]>();
  readonly control = input.required<FormControl<string[]>>();
  readonly searchPlaceholder = input('Search…');
  readonly emptyListHint = input('No matching items.');

  protected readonly searchText = signal('');

  readonly filteredOptions = computed(() => {
    const q = this.searchText().trim().toLowerCase();
    const opts = this.options();
    if (!q) return opts;
    return opts.filter(
      (o) => o.label.toLowerCase().includes(q) || o.id.toLowerCase().includes(q),
    );
  });

  protected onSearchInput(value: string): void {
    this.searchText.set(value);
  }

  protected selectedChips(): readonly LumMultiSearchPickOption[] {
    const ids = this.control().value ?? [];
    const map = new Map(this.options().map((o) => [o.id, o] as const));
    return ids.map((id) => map.get(id)).filter((o): o is LumMultiSearchPickOption => o != null);
  }

  protected isSelected(id: string): boolean {
    return (this.control().value ?? []).includes(id);
  }

  protected toggle(id: string): void {
    const c = this.control();
    const cur = [...(c.value ?? [])];
    const i = cur.indexOf(id);
    if (i >= 0) {
      cur.splice(i, 1);
    } else {
      cur.push(id);
    }
    c.setValue(cur);
  }

  protected removeId(id: string): void {
    const c = this.control();
    c.setValue((c.value ?? []).filter((x) => x !== id));
  }
}
