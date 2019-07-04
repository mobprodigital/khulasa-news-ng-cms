import { Routes, RouterModule } from '@angular/router';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { NgModule } from '@angular/core';

const routes: Routes = [


  {
    path: 'all-users',
    component: AllUsersComponent
  },
  {
    path: ':id',
    component: AddNewUserComponent
  },
  {
    path: '',
    component: AddNewUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule { }