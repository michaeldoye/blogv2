import { Component } from '@angular/core';
import { UpdateService } from './shared/services/update.service';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'blog';

  constructor(private us: UpdateService) {
    if (environment.production) {
      us.checkForUpdates();
    }
  }

}
