import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase';

@Component({
  selector: 'app-frontend-container',
  templateUrl: './frontend-container.component.html',
  styleUrls: ['./frontend-container.component.scss'],
})
export class FrontendContainerComponent {
  loggedIn: User;
  constructor(private route: ActivatedRoute) {
    if (this.route.snapshot.data && this.route.snapshot.data.auth) {
      const authObj = this.route.snapshot.data.auth.uid;
      this.loggedIn = authObj;
    }
  }
}
