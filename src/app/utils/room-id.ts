import { humanId } from 'human-id';

export function generateRoomId(): string {
  return humanId({
    separator: '-',
    capitalize: false,
  });
}
