import { Component, OnInit } from '@angular/core';
import { routeAnimation } from '../../../route.animation';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import UserCredential = firebase.auth.UserCredential;
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  host: {
    '[@routeAnimation]': 'true',
  },
  animations: [routeAnimation],
})
export class LoginPageComponent implements OnInit {
  email: string = '';
  password: string = '';

  hide: boolean = true;
  rememberMe: boolean = true;

  isLoading: Boolean = false;

  users: Observable<any>;
  usersRef: AngularFireList<any>;

  constructor(
    public afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private sb: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.logOut();
    this.usersRef = this.db.list('users');
    this.users = this.usersRef.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }));
      })
    );
  }

  login() {
    this.isLoading = true;
    this.afAuth
      .signInWithEmailAndPassword(this.email, this.password)
      .then((auth: UserCredential) => {
        if (auth.user.uid !== null) {
          this.db
            .object(`/users/${auth.user.uid}`)
            .valueChanges()
            .subscribe((data: any) => {
              data.uid = auth.user.uid;
              this.router.navigate(['/admin']);
            });
        }
      })
      .catch((error) => {
        this.sb.open(error.message, '', { duration: 5000 });
        this.isLoading = false;
      });
  }

  logOut() {
    this.afAuth.signOut().then(() => console.log('logged out'));
  }
}
