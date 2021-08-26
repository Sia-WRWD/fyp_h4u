import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { userInfo } from 'src/app/shared/models/userInfo';
import { ManageUsersService } from 'src/app/shared/services/manage-users.service';

@Component({
  selector: 'app-info-users',
  templateUrl: './info-users.component.html',
  styleUrls: ['./info-users.component.scss']
})
export class InfoUsersComponent implements OnInit {

  user_id!: string | null;
  c_user_id!: number;
  userData: userInfo[] = [];
  userDataDisplay!: any[];

  userProfile!: {form: FormGroup, readMode: boolean};
  userInfoForm!: FormGroup;
  isUpdatingUserInfo: boolean = false;
  dateFormat: string = 'dd-MM-yyyy';

  constructor(
    private route: ActivatedRoute,
    private _manageUsersService: ManageUsersService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: NzMessageService,

    ) { }

  ngOnInit(): void {
    this.getUserID();
    this.loadUserData();
    this.initializeUserInfoForm();
  }

  //Forms
  initializeUserInfoForm() {
    let user = this.userInfoForm = this.fb.group ({
      username:[{ value: null,disabled: true },[Validators.required]],
      email:[{ value: null, disabled: true },[Validators.required, Validators.email]],
      first_name:[{ value: null, disabled: true },[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
      last_name:[{ value: null, disabled: true },[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
      gender:[{ value: null, disabled: true },[Validators.required]],
      birthday:[{ value: null, disabled: true },[Validators.required]],
      phone_number:[{ value: null, disabled: true }, [Validators.required,RxwebValidators.pattern({expression:{'phoneNum': /^[0-9]{9,10}$/} })]],
      role:[{ value: null, disabled: true },[Validators.required]],
      address:[{ value: null, disabled: true },[Validators.required]],
      postcode:[{ value: null, disabled: true },[Validators.required]],
      city:[{ value: null, disabled: true },[Validators.required]],
      state:[{ value: null, disabled: true },[Validators.required]]
    });

    this.userProfile = { form: user, readMode: true };
  }

  //Get formControls' Values
  get username() { return this.userProfile.form.get('username') };
  get email() { return this.userProfile.form.get('email') };
  get first_name() { return this.userProfile.form.get('first_name') };
  get last_name() { return this.userProfile.form.get('last_name') };
  get gender() { return this.userProfile.form.get('gender') };
  get birthday() { return this.userProfile.form.get('birthday') };
  get phone_number() { return this.userProfile.form.get('phone_number') };
  get role() { return this.userProfile.form.get('role') };
  get address() { return this.userProfile.form.get('address') };
  get postcode() { return this.userProfile.form.get('postcode') };
  get city() { return this.userProfile.form.get('city') };
  get state() { return this.userProfile.form.get('state') };

  onUpdateUserInfo() {

    this.isUpdatingUserInfo = true;

    let user = this.userProfile.form.value;
    
    this._manageUsersService.updateUserInfo(this.c_user_id, user).subscribe((result) => {
      this.isUpdatingUserInfo = false;
      this.changeFormState('user');
      this.messageService.create('success', 'Profile is Updated Successfully!');
      this.updateCurrentProfile(user);
    }, (error) => {
      this.isUpdatingUserInfo = false;
      console.log(error);

      if(error.status === 400) {
        this.messageService.create('error', 'Something Went Wrong, Make Sure the Inputs are Correct and Try Again!');
      }

      if(error.status === 403) {
        this.messageService.create('error', 'Action not Allowed!');
      }

      if(error.status === 401) {
        this.router.navigate(['/login']);
      }
    })
  }

  changeFormState(form: string) {
    if(form === 'user') {
      this.userProfile.readMode = !this.userProfile.readMode;

      if(!this.userProfile.readMode) {
        this.enableProfileEdit();
        return;
      }
    }
    
    if(this.userProfile.readMode)
      this.resetProfileForm();

    return;
  }

  resetProfileForm() {
    this.userProfile.form.reset();

    this.setProfileValue();

    for(const key in this.userProfile.form.controls){
      this.userProfile.form.controls[key].disable();
      this.userProfile.form.controls[key].markAsPristine;
      this.userProfile.form.controls[key].updateValueAndValidity;
    }
  }

  enableProfileEdit() {
    this.username?.enable();
    this.email?.enable();
    this.first_name?.enable();
    this.last_name?.enable();
    this.gender?.enable();
    this.birthday?.enable();
    this.phone_number?.enable();
    this.role?.enable();
    this.address?.enable();
    this.postcode?.enable();
    this.city?.enable();
    this.state?.enable();
  }

  setProfileValue() {
    this.userProfile.form.setValue({
      username: this.userDataDisplay[0].user_username,
      email: this.userDataDisplay[0].user_email,
      first_name: this.userDataDisplay[0].user_first_name,
      last_name: this.userDataDisplay[0].user_last_name,
      gender: this.userDataDisplay[0].user_gender,
      birthday: this.userDataDisplay[0].user_birthday,
      phone_number: this.userDataDisplay[0].user_phone_number,
      role: this.userDataDisplay[0].user_role,
      address: this.userDataDisplay[0].user_address,
      postcode: this.userDataDisplay[0].user_postcode,
      city: this.userDataDisplay[0].user_city,
      state: this.userDataDisplay[0].user_state,
    })
  }

  updateCurrentProfile(user: any) {
    this.userDataDisplay[0].user_username = user.username;
    this.userDataDisplay[0].user_email = user.email;
    this.userDataDisplay[0].user_first_name = user.first_name;
    this.userDataDisplay[0].user_last_name = user.last_name;
    this.userDataDisplay[0].user_gender = user.gender;
    this.userDataDisplay[0].user_birthday = user.birthday;
    this.userDataDisplay[0].user_phone_number = user.phone_number;
    this.userDataDisplay[0].user_role = user.role;
    this.userDataDisplay[0].user_address = user.address;
    this.userDataDisplay[0].user_postcode = user.postcode;
    this.userDataDisplay[0].user_city = user.city;
    this.userDataDisplay[0].user_state = user.state;
  }

  //Back Function
  back2Manage(): void {
    this.router.navigate(['welcome/manage-users']);
  }

  //Fetch User Data
  getUserID() {
    this.user_id = this.route.snapshot.paramMap.get('id')
    this.c_user_id = parseInt(this.user_id, 10);
  }

  loadUserData() {
    this._manageUsersService.getUserData(this.c_user_id).subscribe((userInfo) => {
      this.userData = userInfo;
      this.userDataDisplay = [...this.userData]
      this.setProfileValue();
      console.log(this.userData);
    })
  }
}
