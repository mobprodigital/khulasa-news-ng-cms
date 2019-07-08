import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/model/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserAccountService } from 'src/app/service/user-account/user-account.service';
import { UserRoleModel } from 'src/app/model/user-role.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/custom-valiators/must-match.validator';


@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {

  public loading: boolean = true;
  public newUser: boolean = true;
  public userRoles: UserRoleModel[] = [];

  public userForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userAccountService: UserAccountService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {


    Promise.all([
      this.createUserForm(),
      this.getUserId(),
      this.userAccountService.getRoles()
    ]).then(data => {
      this.userRoles = data[2];
      const userId = data[1];
      if (userId) {
        this.loading = true;
        this.newUser = false;
        this.getUserById(data[1]);
      } else {
        this.newUser = true;
        this.loading = false;
      }
    }).catch(err => {
      this.newUser = true;
    });
  }

  private async createUserForm() {
    this.userForm = this.fb.group({
      userId: [null],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      mobile: [''],
      skype: [''],
      role: this.fb.group(
        {
          roleId: [null, Validators.required]
        }
      ),
      image: [''],
    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
    return Promise.resolve();
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      if (this.newUser) {
        this.userAccountService.addUser(this.userForm.value).then(resp => {
          alert(resp);
        }).catch(err => console.log(err)).finally(() => {
          this.loading = false;
          this.userForm.reset();
        });
      } else {
        this.userAccountService.updateUser(this.userForm.value).then(resp => {
          alert(resp);
        }).catch(err => console.log(err)).finally(() => {
          this.loading = false;
          this.userForm.reset();
        });
      }
    }
  }

  private async getUserId(): Promise<number> {
    const userId = this.activatedRoute.snapshot.paramMap.get('id');
    if (userId) {
      return Promise.resolve(parseInt(userId, 10));
    } else {
      return Promise.resolve(null);
    }

  }

  private async getUserById(userId: number) {
    try {
      if (userId) {
        this.userAccountService.getUser(userId)
          .then(user => this.resetForm(user))
          .finally(() => this.loading = false);
      }
    } catch (err) {
      alert(err);
    }
  }

  private resetForm(user: UserModel) {
    if (user) {
      this.userForm.patchValue({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        skype: user.skype,
        image: user.image,
      });

      this.userForm.get('role').patchValue({
        roleId: user.role.roleId
      });

      const passControl = this.userForm.get('password');
      passControl.setValidators(null);
      passControl.updateValueAndValidity();

      const cnfmPassControl = this.userForm.get('confirmPassword');
      cnfmPassControl.setValidators(null);
      cnfmPassControl.updateValueAndValidity();

    }
  }


}
