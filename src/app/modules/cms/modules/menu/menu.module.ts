import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { AllMenuComponent } from './components/all-menu/all-menu.component';
import {
  MatCardModule, MatFormFieldModule, MatInputModule,
  MatCheckboxModule, MatChipsModule, MatIconModule, MatButtonModule,
  MatExpansionModule, MatTableModule, MatDialogModule, MatProgressBarModule,
  MatSelectModule, MatSnackBarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [AddMenuComponent, AllMenuComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule

  ]
})
export class MenuModule { }
