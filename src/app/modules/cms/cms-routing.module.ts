import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonComponent } from './components/common/common.component';

const routes: Routes = [
  {
    path: '',
    component: CommonComponent,
    children: [
      {
        path: 'news',
        loadChildren: './modules/news/news.module#NewsModule'
      },
      {
        path: 'media',
        loadChildren: './modules/media/media.module#MediaModule'
      },
      {
        path: 'user-account',
        loadChildren: './modules/user-account/user-account.module#UserAccountModule'
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
