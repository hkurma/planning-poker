import { Routes } from '@angular/router';
import { Lobby } from './lobby/lobby';
import { Room } from './room/room';

export const routes: Routes = [
  { path: '', component: Lobby },
  { path: ':roomId', component: Room },
];
