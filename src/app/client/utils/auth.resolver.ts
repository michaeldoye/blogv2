import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { User } from 'firebase';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<User> {
  constructor(private afAuth: AngularFireAuth) {}
  resolve(): Observable<User> {
    return this.afAuth.user.pipe(take(1));
  }
}
