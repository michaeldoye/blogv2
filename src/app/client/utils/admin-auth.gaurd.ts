import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private rt: Router,
    private afAuth: AngularFireAuth,
    private sb: MatSnackBar
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.afAuth.authState.pipe(
      map((auth) => {
        if (!auth) {
          this.sb.open('You do not have permission to access this page', '', {
            duration: 5000,
          });
          this.rt.navigate(['/']);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
