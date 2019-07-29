import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { AllMenuComponent } from './components/all-menu/all-menu.component';

@NgModule({
  declarations: [AddMenuComponent, AllMenuComponent],
  imports: [
    CommonModule,
    MenuRoutingModule
  ]
})
export class MenuModule { }
