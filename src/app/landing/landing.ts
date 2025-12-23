import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent, ButtonComponent } from '../components';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, LogoComponent, ButtonComponent],
  templateUrl: './landing.html',
})
export class Landing {}

