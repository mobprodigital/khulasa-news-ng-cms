import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  declarations: [
    NotFoundComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  exports: [
    NotFoundComponent,
    ProgressBarComponent
  ]
})
export class SharedModule { }
