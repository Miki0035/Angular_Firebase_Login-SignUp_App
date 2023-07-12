import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  action: 'signup' | 'login' = 'login'
  error?: string;
  constructor(private afAuth: AngularFireAuth,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  async onSubmit(form: NgForm){
    this.loading = true;
    this.error = '';
    const {email, password, firstName, lastName} = form.value;
    let resp;
    try {
      if(this.isSignUp) {
        resp = await this.afAuth.createUserWithEmailAndPassword(email, password);
        await resp.user?.updateProfile({displayName: `${firstName} ${lastName}`});
        await this.authService.createUserDocument();
      } else {
        resp = await this.afAuth.signInWithEmailAndPassword(email, password);
      }
      form.reset();
      const userId = resp.user!.uid;
     this.authService.routeOnLogin();

    } catch (error: any) {
      console.log(error.message); 
      this.error = error.message;     
    }
    this.loading = false;
  }

  get isLogin() {
    return this.action === 'login';
  }

  get isSignUp() {
    return this.action === 'signup';
  }


}
