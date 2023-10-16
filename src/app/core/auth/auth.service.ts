import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProfile } from './user-profile.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor(private router: Router,
              private afs: AngularFirestore,
              private afAuth: AngularFireAuth) { }

  logout() {
    this.afAuth.signOut();
    this.router.navigateByUrl(' ');
  }

  isLoggedIn() {
    return !!this.afAuth.currentUser;
  }

  createUserDocument() {
    this.afAuth.authState.subscribe(user => {
      const userProfile: UserProfile = {
        uid: user!.uid,
        email: user!.email || '',
        name: user!.displayName || '',
        address: '',
        city: '',
        zip: '',
        state: '',
        specialty: '',
        ip: '',
        phone: ''
      };
    return this.afs.doc(`users/${user!.uid}`).set(userProfile);
    });
  }

  updateUserDocument(userProfile: UserProfile) {
   return this.afs.doc(`users/${userProfile.uid}`).update(userProfile); 
  }

  async routeOnLogin() {
    this.afAuth.authState.subscribe(user => this.user = user);
    const token = await this.user.getIdTokenResult();

    if(token.claims.admin) {
      this.router.navigate(['/users']);
    } else {
      this.router.navigate([`/profile/${this.user.uid}`]);
    }
  }

}
