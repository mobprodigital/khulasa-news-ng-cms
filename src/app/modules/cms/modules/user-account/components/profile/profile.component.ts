import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAccountService } from 'src/app/service/user-account/user-account.service';
import { MustMatch } from 'src/app/custom-valiators/must-match.validator';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserModel } from 'src/app/model/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  public userForm: FormGroup;
  public loading: boolean;
  constructor(
    private userAccountService: UserAccountService,
    private fb: FormBuilder,
    private authSvc: AuthService
  ) {

  }

  ngOnInit() {

    this.createUserForm().then(() => {
      this.getUserData();
    });

  }

  private async createUserForm() {
    this.userForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null],
      password: ['', [Validators.minLength(5)]],
      confirmPassword: [''],
      mobile: [null],
      skype: [null],
      image: [null],
    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
    return Promise.resolve();
  }

  private async getUserData() {
    this.loading = true;
    this.userAccountService.getUser(this.authSvc.loggedInUser.userId)
      .then(user => this.resetForm(user))
      .catch(err => {

      })
      .finally(() => this.loading = false);
  }

  private resetForm(user: UserModel) {
    if (user) {
      this.userForm.patchValue({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        skype: user.skype,
        image: user.image,
      });
    }
  }


  public onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      this.userAccountService.updateProfile(this.userForm.value).then(user => {
        this.authSvc.loggedInUser = user;
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }).catch(err => console.log(err)).finally(() => this.loading = false);
    }
  }

}
