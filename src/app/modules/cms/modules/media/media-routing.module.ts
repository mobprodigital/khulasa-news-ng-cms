import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewMediaComponent } from './components/add-new-media/add-new-media.component';
import { AllMediaComponent } from './components/all-media/all-media.component';

const routes: Routes = [
  {
    path : 'add-new',
    component : AddNewMediaComponent
  },
  {
    path : 'all-media',
    component : AllMediaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }
