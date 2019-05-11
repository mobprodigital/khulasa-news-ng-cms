import { Routes, RouterModule } from '@angular/router';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'add-new',
    component: AddNewUserComponent
  },
  {
    path: 'edit/:id',
    component: AddNewUserComponent
  },
  {
    path: 'all-users',
    component: AllUsersComponent
  },
  {
    path: '',
    redirectTo: 'add-new',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccountRoutingModule { }