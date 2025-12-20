import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-voting-cards',
  standalone: true,
  templateUrl: './voting-cards.component.html',
})
export class VotingCardsComponent {
  cards = input<string[]>(['0', '½', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕']);
  selectedCard = input<string | null>(null);
  disabled = input<boolean>(false);
  consensusState = input<'none' | 'consensus' | 'no-consensus'>('none');

  cardSelected = output<string>();
}
