import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { filter } from 'rxjs/operators';
import { BasicInfoService } from 'src/app/shared/services/basic-info.service';
import { ContactInfoService } from 'src/app/shared/services/contact-info.service';
import { UserAddressService } from 'src/app/shared/services/user-address.service';

//Sample Data

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isEditingUsername: boolean = false;
  editUsernameForm!: FormGroup;
  editBasicInfoForm!: FormGroup;
  editContactInfoForm! : FormGroup;
  fileList: NzUploadFile[] = [];
  isUploading: boolean = false;
  selectedIndex: number = 0;
  basicInfoData!: any;
  contactInfoData!: any;
  userAddressData!: any;
  dateFormat: string = 'dd-MM-yyyy';

  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private http: HttpClient,
    private _basicInfoService: BasicInfoService,
    private _contactInfoService: ContactInfoService,
    private _userAddressService: UserAddressService
  ) { }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  }

  ngOnInit(): void {
    this.initializeEditUsernameForm();
    this.initializeEditBasicInfoForm();
    this.initializeContactInfoForm();
    this.getAllUserInfo();
  }

  //Edit Username
  initializeEditUsernameForm() {
    this.editUsernameForm = this.fb.group ({
      username: [null, [Validators.required]]
    });
    this.isEditingUsername = false;
  }

  startEditUsername() {
    this.isEditingUsername = true;
  }

  cancelEditUsername() {
    this.resetUsernameForm();

    this.isEditingUsername = false;
  }

  resetUsernameForm() {

    this.editUsernameForm.reset()

    this.isEditingUsername = false;

    for(const key in this.editUsernameForm.controls){
      this.editUsernameForm.controls[key].markAsPristine;
      this.editUsernameForm.controls[key].updateValueAndValidity;
    }
  }

  onEditUsername() {
    this.isEditingUsername = true;

    console.log(this.editUsernameForm);

    this.isEditingUsername = false;
    this.resetUsernameForm();
    this.reloadPage();

    this.messageService.create('success','Username Successfully Updated! Reloading...');
  }

  reloadPage() {
    setTimeout(location.reload.bind(location), 3000);
  }

  //Profile Picture
  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.isUploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.isUploading = false;
          this.fileList = [];
          this.messageService.success('upload successfully.');
        },
        () => {
          this.isUploading = false;
          this.messageService.error('upload failed.');
        }
      );
  }

  //Services
  getAllUserInfo() {
    this.basicInfoData = this._basicInfoService.getBasicInfo();
    this.setUsernameValue();

    this.contactInfoData = this._contactInfoService.getContactInfo();
    this.setBasicInfoFormValue();
    console.log(this.contactInfoData[0].email)

    this.userAddressData = this._userAddressService.getUserAddress();
    this.setContactInfoFormValue();
  }

  //Set Form Values
  setBasicInfoFormValue() {
    this.editBasicInfoForm.setValue({
      first_name: this.basicInfoData[0]?.first_name,
      last_name: this.basicInfoData[0]?.last_name,
      gender: this.basicInfoData[0]?.gender,
      birthday: new Date(this.basicInfoData[0]?.birthday),
      email: this.contactInfoData[0]?.email,
      phone_number: this.contactInfoData[0]?.phone_number
    })
  }

  setUsernameValue() {
    this.editUsernameForm.patchValue({
      username: this.basicInfoData[0]?.username
    });
  }

  setContactInfoFormValue() {
    this.editContactInfoForm.setValue({
      address: this.userAddressData[0]?.address,
      postcode: this.userAddressData[0]?.postcode,
      city: this.userAddressData[0]?.city,
      state: this.userAddressData[0]?.state,
    })
  }

  //Info-Tab
  selectedIndexChange(val: number) {
    this.selectedIndex = val;
  }

  directEditTab() {
    this.selectedIndex = 1;
  }

  //Edit-Tab
  initializeEditBasicInfoForm() {
    this.editBasicInfoForm = this.fb.group ({
      first_name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      last_name: [null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      gender: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone_number: [null, [Validators.required, RxwebValidators.pattern({ expression: {'phoneNum': /^[0-9]{9,10}$/}})]]
    });
  }

  //Grab Basic-Info Data
  get first_name(){ return this.editBasicInfoForm.get('first_name') };
  get last_name(){ return this.editBasicInfoForm.get('last_name') };
  get gender(){ return this.editBasicInfoForm.get('gender') };
  get birthday(){ return this.editBasicInfoForm.get('birthday') };
  get email(){ return this.editBasicInfoForm.get('email') };
  get phone_number(){ return this.editBasicInfoForm.get('phone_number') };

  //Submit Basic-Info Form
  submitBasicInfoForm() {
    console.log(this.editBasicInfoForm);
  }

  initializeContactInfoForm() {
    this.editContactInfoForm = this.fb.group ({
      address: [null, [Validators.required]],
      postcode: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]]
    });
  }

  //Grab Contact-Info Data
  get address(){ return this.editContactInfoForm.get('address') };
  get postcode(){ return this.editContactInfoForm.get('postcode') };
  get city(){ return this.editContactInfoForm.get('city') };
  get state(){ return this.editContactInfoForm.get('state') };

  //Submit Contact-Info Form
  submitContactInfoForm() {
    console.log(this.editContactInfoForm);
  }
}
