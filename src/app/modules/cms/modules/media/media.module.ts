import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { AddNewMediaComponent } from './components/add-new-media/add-new-media.component';
import { AllMediaComponent } from './components/all-media/all-media.component';
import { MatCardModule } from '@angular/material';

@NgModule({
  declarations: [AddNewMediaComponent, AllMediaComponent],
  imports: [
    CommonModule,
    MediaRoutingModule,
    MatCardModule
  ]
})
export class MediaModule { }
