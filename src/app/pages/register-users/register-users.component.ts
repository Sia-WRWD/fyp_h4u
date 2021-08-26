import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageUsersService } from 'src/app/shared/services/manage-users.service';

@Component({
  selector: 'app-register-users',
  templateUrl: './register-users.component.html',
  styleUrls: ['./register-users.component.scss']
})
export class RegisterUsersComponent implements OnInit {

  registrationForm!: FormGroup;
  dateFormat: string = 'dd-MM-yyyy';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _manageUserService: ManageUsersService,
    private messageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.initializeRegistrationForm();
  }

  back2Manage(): void {
    this.router.navigate(['welcome/manage-users']);
  }

  //Forms
  initializeRegistrationForm() {
    this.registrationForm = this.fb.group ({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      first_name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      last_name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      gender: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      phone_number: [null, [Validators.required, RxwebValidators.pattern({ expression: {'phoneNum': /^[0-9]{9,10}$/}})]],
      role: [null, [Validators.required]],
      address: [null, [Validators.required]],
      postcode: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]]    
    });
  }

  get username(){ return this.registrationForm.get('username') };
  get email(){ return this.registrationForm.get('email') };
  get password(){ return this.registrationForm.get('password') };
  get first_name(){ return this.registrationForm.get('first_name') };
  get last_name(){ return this.registrationForm.get('last_name') };
  get gender(){ return this.registrationForm.get('gender') };
  get birthday(){ return this.registrationForm.get('birthday') };
  get phone_number(){ return this.registrationForm.get('phone_number') };
  get role(){ return this.registrationForm.get('role') };
  get address(){ return this.registrationForm.get('address') };
  get postcode(){ return this.registrationForm.get('postcode') };
  get city(){ return this.registrationForm.get('city') };
  get state(){ return this.registrationForm.get('state') };

  registerUser() {
    this._manageUserService.saveUserData(this.registrationForm.value).subscribe((result) => {
      this.messageService.create('success', 'User has Been Successfully Registered! Reloading...');

      this.resetRegistrationForm();
      this.reloadPage();
    }, (error) => {
      console.log(error);

      if(error.status === 1) {
        this.messageService.create('error', 'User with this Username Already Existed!');
      }

      if(error.status === 2) {
        this.messageService.create('error', 'User with this Email Already Existed!');
      }

      if(error.status === 400) {
        this.messageService.create('error', 'Something Went Wrong, Please Try Again Later!');
      }
      
      if(error.status === 404) {
        this.messageService.create('error', 'Something Went Wrong, Please Contact the Admin!');
      }

      if(error.status === 403) {
        this.messageService.create('warning','Action Not Allowed!');
      }

      if(error.status === 401) {
        this.router.navigate(['/login']);
      }
    });
  }

  resetRegistrationForm(): void {
    this.registrationForm.reset();
    
    for(const key in this.registrationForm.controls) {
      this.registrationForm.controls[key].markAsPristine;
      this.registrationForm.controls[key].updateValueAndValidity;
    }
  }

  reloadPage(): void {
    setTimeout(location.reload.bind(location), 3000);
    this.router.navigate(['welcome/manage-users']);
  }
}
