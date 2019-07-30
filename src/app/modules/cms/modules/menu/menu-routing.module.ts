import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { AllMenuComponent } from './components/all-menu/all-menu.component';

const routes: Routes = [
  {
    path: 'add-new-menu',
    component: AddMenuComponent
  },
  {
    path: 'all-menu',
    component: AllMenuComponent
  },
  {
    path: 'edit/:id',
    component: AddMenuComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
