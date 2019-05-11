import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewNewsComponent } from './components/add-new-news/add-new-news.component';
import { AllNewsComponent } from './components/all-news/all-news.component';
import { ManageNewsCategoryComponent } from './components/manage-news-category/manage-news-category.component';

const routes: Routes = [
  {
    path: 'add-new',
    component: AddNewNewsComponent
  },
  {
    path: 'edit/:id',
    component: AddNewNewsComponent
  },
  {
    path: 'all-news',
    component: AllNewsComponent
  },
  {
    path: 'manage-categories',
    component: ManageNewsCategoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
