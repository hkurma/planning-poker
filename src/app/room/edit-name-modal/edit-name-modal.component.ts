import { Component, input, output, signal, OnInit } from '@angular/core';
import { ButtonComponent, InputComponent } from '../../components';

@Component({
  selector: 'app-edit-name-modal',
  standalone: true,
  imports: [ButtonComponent, InputComponent],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 max-w-sm w-full mx-4">
        <h2 class="text-lg font-bold text-slate-800 dark:text-white mb-4">Edit Your Name</h2>
        
        <app-input
          [value]="editedName()"
          (valueChange)="editedName.set($event)"
          (keydown.enter)="onSave()"
          placeholder="Enter your name"
          size="md"
          [autofocus]="true"
        />

        <div class="flex gap-3 mt-4">
          <app-button
            variant="secondary"
            [fullWidth]="true"
            (clicked)="cancelled.emit()"
          >
            Cancel
          </app-button>
          <app-button
            [fullWidth]="true"
            [disabled]="!editedName().trim()"
            (clicked)="onSave()"
          >
            Save
          </app-button>
        </div>
      </div>
    </div>
  `,
})
export class EditNameModalComponent implements OnInit {
  currentName = input.required<string>();

  saved = output<string>();
  cancelled = output<void>();

  editedName = signal('');

  ngOnInit() {
    this.editedName.set(this.currentName());
  }

  onSave() {
    const name = this.editedName().trim();
    if (name && name !== this.currentName()) {
      this.saved.emit(name);
    } else {
      this.cancelled.emit();
    }
  }
}

