import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class UpdateService {
  constructor(public updates: SwUpdate, public snackBar: MatSnackBar) {
    // If updates are enabled
    if (updates.isEnabled) {
      interval(6 * 60 * 60).subscribe(() =>
        updates.checkForUpdate().then(() => console.log('checking for updates'))
      );
    }
  }

  // Called from app.components.ts constructor
  public checkForUpdates() {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe((event) => {
        console.log('current version is', event.current);
        console.log('available version is', event.available);
        this.promptUser(event);
      });
      this.updates.activated.subscribe((event) => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });
    }
  }

  // If there is an update, prompt the user
  private promptUser(e): void {
    if (e.available) {
      const snackBarRef = this.snackBar.open(
        'A new version of the blog is available',
        'Update',
        { horizontalPosition: 'center' }
      );
      snackBarRef.onAction().subscribe(() => document.location.reload());
    }
  }
}
