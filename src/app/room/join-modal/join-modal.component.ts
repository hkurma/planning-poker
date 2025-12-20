import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './join-modal.component.html',
})
export class JoinModalComponent {
  roomId = input.required<string>();
  isLoading = input<boolean>(false);
  playerName = model<string>('');

  cancelled = output<void>();
  joined = output<string>();

  onJoin() {
    if (this.playerName().trim()) {
      this.joined.emit(this.playerName().trim());
    }
  }
}
