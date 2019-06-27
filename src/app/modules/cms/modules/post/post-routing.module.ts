import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewPostComponent } from './components/add-new-post/add-new-post.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { ManagePostCategoryComponent } from './components/manage-post-category/manage-post-category.component';

const routes: Routes = [
  {
    path: 'add-new',
    component: AddNewPostComponent
  },
  {
    path: 'edit/:id',
    component: AddNewPostComponent
  },
  {
    path: 'all-news',
    component: AllPostsComponent
  },
  {
    path: 'manage-categories',
    component: ManagePostCategoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
