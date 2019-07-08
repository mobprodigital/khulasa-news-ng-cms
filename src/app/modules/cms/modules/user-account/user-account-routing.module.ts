import { Routes, RouterModule } from '@angular/router';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [


  {
    path: 'add-new',
    component: AddNewUserComponent
  },
  {
    path: 'update-profile',
    component: ProfileComponent
  },
  {
    path: ':id',
    component: AddNewUserComponent
  },
  {
    path: '',
    component: AllUsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule { }