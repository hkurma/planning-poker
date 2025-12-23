import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Lobby } from './lobby/lobby';
import { Room } from './room/room';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'lobby', component: Lobby },
  { path: 'room/:roomId', component: Room },
];
