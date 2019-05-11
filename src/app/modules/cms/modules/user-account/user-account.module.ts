import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountRoutingModule } from './user-account-routing.module';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { MatCardModule,MatTableModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatPaginatorModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MustMatchDirective } from 'src/app/custom-valiators/must-match.directive';
import { UserAccountService } from 'src/app/service/user-account/user-account.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserAccountRoutingModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  declarations: [
    MustMatchDirective,
    AddNewUserComponent,
    AllUsersComponent
  ],
  providers : [UserAccountService]
})
export class UserAccountModule { }
