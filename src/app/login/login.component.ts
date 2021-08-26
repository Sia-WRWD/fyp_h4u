import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { manageUsers } from '../shared/models/manageUsers';
import { ManageLoginService } from '../shared/services/manage-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  listOfUserData: manageUsers[] = [];
  listOfDisplayData!: any[];
  userID!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _manageLogin: ManageLoginService,
    private messageService: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      role: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    this._manageLogin.verifyGrabUser(this.loginForm.value).subscribe((manageUsers) => {
      this.listOfUserData = manageUsers;
      this.listOfDisplayData = [...this.listOfUserData];
      this.messageService.create('Login Success', 'Successfully Login!');

      this.userID = this.listOfDisplayData[0].user_id;

      this.directUser(this.userID);

    }, (error) => {
      if (error.status === 422) {
        this.messageService.create('error', 'Credentials Provided is False');
      }

      if (error.status === 404) {
        this.messageService.create('error', 'Something Went Wrong, Please Contact the Admin!');
      }

      if (error.status === 403) {
        this.messageService.create('warning', 'Action Not Allowed!');
      }
    });
  }

  directUser(user_id: any): void {
    this.router.navigate(['/welcome']);
  }

}
