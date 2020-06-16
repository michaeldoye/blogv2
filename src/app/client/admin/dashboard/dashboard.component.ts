import { Component, OnInit } from '@angular/core';
import { routeAnimation } from '../../../route.animation';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
