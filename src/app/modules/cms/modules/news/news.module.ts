import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { AddNewNewsComponent } from './components/add-new-news/add-new-news.component';
import { AllNewsComponent } from './components/all-news/all-news.component';
import {
  MatCardModule, MatFormFieldModule, MatInputModule,
  MatCheckboxModule, MatChipsModule, MatIconModule, MatButtonModule,
  MatExpansionModule, MatTableModule, MatPaginatorModule, MatDialogModule,
  MatSelectModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddNewsCatDialogComponent } from './dialogs/add-news-cat-dialog/add-news-cat-dialog.component';
import { ManageNewsCategoryComponent } from './components/manage-news-category/manage-news-category.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
@NgModule({
  declarations: [
    AddNewNewsComponent,
    AllNewsComponent,
    AddNewsCatDialogComponent,
    ManageNewsCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    NewsRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  entryComponents: [AddNewsCatDialogComponent]
})
export class NewsModule { }
