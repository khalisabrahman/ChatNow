import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './features/auth/signin/signin.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { AuthGuard, redirectLoggedInTo, canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  // { path: 'signin', component: SigninComponent, canActivate: [AuthGuard], data: {
  //   authGuardPipe: () => redirectLoggedInTo(['chat'])
  // }}, // canActivate checks the array, if all guards return true, navigation continues. // Refactor below
  { path: 'signin', component: SigninComponent, ...canActivate(() => redirectLoggedInTo(['chat'])) },
  { path: 'signup', component: SignupComponent, ...canActivate(() => redirectLoggedInTo(['chat'])) },
  {
    path: 'chat',
    ...canActivate(() => redirectUnauthorizedTo(['signin'])),
    loadChildren: () => import('./features/chat/chat.module').then(m => m.ChatModule) // To lazy load Angular modules, use loadChildren (instead of component) in your AppRoutingModule routes configuration
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
