import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/model/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserAccountService } from 'src/app/service/user-account/user-account.service';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {

  public newUser: boolean = true;
  public userModel: UserModel = new UserModel();
  constructor(
    private activatedRoute: ActivatedRoute,
    private userAccountService: UserAccountService
  ) {
    this.getUserId();
  }

  ngOnInit() {
  }


  onSubmit() {
    console.log(this.userModel);
  }

  private getUserId() {
    let userId = this.activatedRoute.snapshot.paramMap.get('id');
    if (userId) {
      this.newUser = false;
      this.getUserById(userId);
    }
    else {
      this.newUser = true;
    }

  }

  private async getUserById(userId: string) {
    try {
      this.userModel = await this.userAccountService.get(userId);
    }
    catch (err) {
      alert(err);
    }
  }


}
