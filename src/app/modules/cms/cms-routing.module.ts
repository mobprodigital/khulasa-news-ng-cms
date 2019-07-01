import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonComponent } from './components/common/common.component';

const routes: Routes = [
  {
    path: '',
    component: CommonComponent,
    children: [
      {
        path: 'post',
        loadChildren: './modules/post/post.module#PostModule'
      },
      {
        path: 'media',
        loadChildren: './modules/media/media.module#MediaModule'
      },
      {
        path: 'user-account',
        loadChildren: './modules/user-account/user-account.module#UserAccountModule',
        canLoad : [  ]
      },
      {
        path: '',
        redirectTo: 'news',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
