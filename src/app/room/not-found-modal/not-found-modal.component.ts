import { Component, output } from '@angular/core';

@Component({
  selector: 'app-not-found-modal',
  standalone: true,
  templateUrl: './not-found-modal.component.html',
})
export class NotFoundModalComponent {
  retry = output<void>();
  returnToLobby = output<void>();
}

