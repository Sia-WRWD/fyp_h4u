import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManageConsultationService } from 'src/app/shared/services/manage-consultation.service';

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.scss']
})
export class AddConsultationComponent implements OnInit {

  addConsultationForm!: FormGroup;
  dateFormat: string = 'dd-MM-yyyy';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _manageConsultation: ManageConsultationService,
    private messageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.initializeAddConsultationForm();
  }

  initializeAddConsultationForm() {
    this.addConsultationForm = this.fb.group ({
      date: [null, [Validators.required]],
      time: [null, [Validators.required]],
      consultor: [null, [Validators.required]],
      consultee: [null, [Validators.required]],
      type: [null, [Validators.required]],
      platform: [null, [Validators.required]],
      comment: [null, [Validators.required]],
      status: [null, [Validators.required]]
    });
  }

    //Get Form Controls Value
    get date() { return this.addConsultationForm.get('date') };
    get time() { return this.addConsultationForm.get('time') };
    get consultor() { return this.addConsultationForm.get('consultor') };
    get consultee() { return this.addConsultationForm.get('consultee') };
    get type() { return this.addConsultationForm.get('type') };
    get platform() { return this.addConsultationForm.get('platform') };
    get comment() { return this.addConsultationForm.get('comment') };
    get status() { return this.addConsultationForm.get('status') };

  addConsultation() {
    this._manageConsultation.saveConsultationData(this.addConsultationForm.value).subscribe((result) => {

      this.messageService.create('success', 'Consultation has Been Successfully Added! Reloading...');

      this.resetAddForm();
      this.reloadPage();
    }, (error) => {
      console.log(error);

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

  resetAddForm(): void {
    this.addConsultationForm.reset();
    
    for(const key in this.addConsultationForm.controls) {
      this.addConsultationForm.controls[key].markAsPristine;
      this.addConsultationForm.controls[key].updateValueAndValidity;
    }
  }

  reloadPage(): void {
    setTimeout(location.reload.bind(location), 3000);
    this.router.navigate(['welcome/manage-consultation']);
  }

  back2Manage(): void {
    this.router.navigate(['welcome/manage-consultation']);
  }

}
