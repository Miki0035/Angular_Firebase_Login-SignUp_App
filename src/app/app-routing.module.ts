import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo, customClaims} from '@angular/fire/compat/auth-guard';
import { map, pipe } from 'rxjs';
import { UsersComponent } from './users/users.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

const redirectLoggedInToProfilePage = () => 
  map(users => users ? ['profile',(users as any).uid]: true);

const onlyAllowSelf = (next: any) =>
  map(users => (!!users && next.params.id == (users as any).uid) || ['']);

const adminOnly = () => pipe(
  customClaims,
  map(claims => claims.admin === true || [''])
)

const redirectLoggedInToProfileOrUsers = () => 
  pipe(
    customClaims,
    map(claims =>{
      if(claims.length === 0) {
        return true;
      }
      if(claims.admin){
        return['users'];
      }

      return ['profile', claims.user_id];
    })
  )

  const allowOnlySelfOrAdmin = (next: { params: { id: string; }; }) => 
    pipe(
      customClaims,
      map(claims => {
        if(claims.length = 0) {
          return ['']
        }
        return next.params.id === claims.user_id || claims.admin;
      })
    )

const routes: Routes = [
  { 
    path:' ', 
    component: LoginComponent, 
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToProfileOrUsers}, 
    pathMatch: 'full'
  },
  {
    path:'profile/:id', 
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: allowOnlySelfOrAdmin}
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: adminOnly },

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
