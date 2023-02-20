import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { BehaviorSubject, catchError, forkJoin, from, Observable, of, switchMap, tap } from 'rxjs';
import { SigninCredentials, SignupCredentials } from './auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private authState = new BehaviorSubject<Object | null>(null);
  
  readonly isLoggedIn$ = authState(this.auth);

  constructor(private auth: Auth, private http: HttpClient) { }

  signIn({ email, password }: SigninCredentials) {
    return from(signInWithEmailAndPassword(this.auth, email, password ));
  }

  signUp({ email, password, displayName }: SignupCredentials) {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      // tap(res => console.log(res)),
      switchMap(({ user }) => forkJoin([
        updateProfile(user, { displayName }),
        // Call our Firebase cloud function that we created createStreamUser function
        this.http.post(`${environment.apiUrl}/createStreamUser`,
        { user: {...user, displayName }}).pipe(catchError(error => of(error)))
      ])),
    );
  }

  signOut() {
    return from(this.auth.signOut());
  }
}
