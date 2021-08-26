import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { manageConsultation } from 'src/app/shared/models/manageConsultation';
import { ManageConsultationService } from 'src/app/shared/services/manage-consultation.service';

@Component({
  selector: 'app-manage-consultation',
  templateUrl: './manage-consultation.component.html',
  styleUrls: ['./manage-consultation.component.scss']
})
export class ManageConsultationComponent implements OnInit {

  tableParams!: NzTableQueryParams;
  isLoading = true;
  
  //Filter
  searchTypeValue = '';
  searchPlatformValue = '';
  searchStatusValue = '';
  searchConsultorValue = '';
  searchConsulteeValue = '';
  consultorSearchVisible: boolean = false;
  consulteeSearchVisible: boolean = false;
  typeSearchVisible: boolean = false;
  platformSearchVisible: boolean = false;
  statusSearchVisible: boolean = false;
  
  //Table Params
  total: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;

  //Modal
  infoModalVisible: boolean = false;
  consultationInfo!: {form: FormGroup, readMode: boolean};
  consultationInfoForm!: FormGroup;
  dateFormat: string = 'dd-MM-yyyy';
  isUpdatingConsultationInfo: boolean = false;
  consultationID!: number;

  listOfConsultationData: manageConsultation[] = [];
  listOfDisplayData!: any[];
  listOfSingleConsultationData: manageConsultation[] = [];
  listOfSingleDisplayData!: any[];

  constructor(
    private _manageConsultationService: ManageConsultationService,
    private router: Router,
    private messageService: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadConsultationData();
    this.initializeConsultationInfoForm();
  }

  loadConsultationData() {
    this.isLoading = true;

    this._manageConsultationService.getAllConsultationData().subscribe((manageConsultation) => {
      this.listOfConsultationData = manageConsultation;
      this.listOfDisplayData = [...this.listOfConsultationData];
      // console.log(this.listOfConsultationData);
      this.total = this.listOfConsultationData.length;

      this.isLoading = false;
    });
  }

  //Filters
  resetType(): void {
    this.searchTypeValue = '';
    this.searchType();
    this.total = this.listOfDisplayData.length;
  }

  searchType(): void {
    this.typeSearchVisible = false;
    this.listOfDisplayData = this.listOfConsultationData.filter((item: manageConsultation) => item.consultation_type.indexOf(this.searchTypeValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  resetPlatform(): void {
    this.searchPlatformValue = '';
    this.searchPlatform();
    this.total = this.listOfDisplayData.length;
  }

  searchPlatform(): void {
    this.platformSearchVisible = false;
    this.listOfDisplayData = this.listOfConsultationData.filter((item: manageConsultation) => item.consultation_platform.indexOf(this.searchPlatformValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  resetStatus(): void {
    this.searchStatusValue = '';
    this.searchStatus();
    this.total = this.listOfDisplayData.length;
  }

  searchStatus(): void {
    this.statusSearchVisible = false;
    this.listOfDisplayData = this.listOfConsultationData.filter((item: manageConsultation) => item.consultation_status.indexOf(this.searchStatusValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  resetConsultor(): void {
    this.searchConsultorValue = '';
    this.searchConsultor();
    this.total = this.listOfDisplayData.length;
  } 

  searchConsultor(): void {
    this.consultorSearchVisible = false;
    this.listOfDisplayData = this.listOfConsultationData.filter((item: manageConsultation) => item.consultation_consultor.indexOf(this.searchConsultorValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  resetConsultee(): void {
    this.searchConsulteeValue = '';
    this.searchConsultee();
    this.total = this.listOfDisplayData.length;
  }

  searchConsultee(): void {
    this.consulteeSearchVisible = false;
    this.listOfDisplayData = this.listOfConsultationData.filter((item: manageConsultation) => item.consultation_consultee.indexOf(this.searchConsulteeValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.tableParams = params;
    this.listOfDisplayData;
  }

  reloadTable(): void {
    this.loadConsultationData();
    this.searchTypeValue = '';
    this.searchPlatformValue = '';
    this.searchStatusValue = '';
    this.searchConsultorValue = '';
    this.searchConsulteeValue = '';
    this.total = this.listOfDisplayData.length;
  }

  //User Data
  deleteConsultation(consultation_id: any, modelRef: NzModalRef) {
    this.isLoading = true;

    this._manageConsultationService.deleteConsultationData(consultation_id).subscribe((res) => {
      this.messageService.create('success', 'Consultation has Been Successfully Removed!');

      setTimeout(() => {
        modelRef.destroy();
      }, 10);

      this.reloadTable();
      this.isLoading = false;
      
    }, (error) => {
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

  directInfoPage(consultation_id: any, modelRef: NzModalRef) {
    let url: string = "welcome/manage-consultation/info-consultation/" + consultation_id;
    this.router.navigate([url]);
    setTimeout(() => {
      modelRef.destroy();
    }, 10)
  }

  //Modals
  showOptions(consultation_id: any): void {
    this.consultationID = consultation_id;
    // console.log(this.consultationID);
    const modal: NzModalRef = this.modal.create({
      nzTitle: 'View Consultation Info or Delete Consultation?',
      nzContent: `You can <i>View more details</i> of the consultation by
                 clicking on <b>"View"</b> and <i>Delete the consultation</i> by
                 clicking on <b>"Delete"</b>.`,
      nzFooter: [
        {
          label: 'View',
          type: 'primary',
          onClick: () => this.showInfoModal(modal)
          // this.directInfoPage(consultation_id, modal)
        },
        {
          label: 'Delete',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'Are you sure you want to delete this consultation?',
            nzContent: 'This act is irreversible after execution!',
            nzOnOk: () => this.deleteConsultation(consultation_id, modal)
          })
        }

      ]
    })
  }

  showInfoModal(modelRef: NzModalRef) {
    this.infoModalVisible = true;
    this.fetchSingleConsultationInfo();
    setTimeout(() => {
      modelRef.destroy();
    }, 10)
  }

  closeInfoModal(): void {
    this.infoModalVisible = false;
  }

  //Consultation Info Forms
  initializeConsultationInfoForm() {
    let cInfo = this.consultationInfoForm = this.fb.group ({
      date: [{ value: null, disabled: true },[Validators.required]],
      time: [{ value: null, disabled: true },[Validators.required]],
      consultor: [{ value: null,disabled: true },[Validators.required]],
      consultee: [{ value: null,disabled: true },[Validators.required]],
      type: [{ value: null,disabled: true },[Validators.required]],
      platform: [{ value: null,disabled: true },[Validators.required]],
      comment: [{ value: null,disabled: true },[Validators.required]],
      status: [{ value: null,disabled: true },[Validators.required]]
    });

    this.consultationInfo = { form: cInfo, readMode: true };
  }

  //Get Form Controls Value
  get date() { return this.consultationInfo.form.get('date') };
  get time() { return this.consultationInfo.form.get('time') };
  get consultor() { return this.consultationInfo.form.get('consultor') };
  get consultee() { return this.consultationInfo.form.get('consultee') };
  get type() { return this.consultationInfo.form.get('type') };
  get platform() { return this.consultationInfo.form.get('platform') };
  get comment() { return this.consultationInfo.form.get('comment') };
  get status() { return this.consultationInfo.form.get('status') };

  fetchSingleConsultationInfo() {
    this._manageConsultationService.getConsultationData(this.consultationID).subscribe((manageConsultation) => {
      this.listOfSingleConsultationData = manageConsultation;
      this.listOfSingleDisplayData = [...this.listOfSingleConsultationData];
      this.setCInfoValue();
      console.log(this.listOfSingleDisplayData);
    })
  }

  onUpdateConsultationInfo() {

    this.isUpdatingConsultationInfo = true;

    let cInfo = this.consultationInfo.form.value;
    
    this._manageConsultationService.updateConsultationInfo(this.consultationID, cInfo).subscribe((result) => {
      this.isUpdatingConsultationInfo = false;
      this.changeFormState('cInfo');
      this.messageService.create('success', 'Consultation Info is Updated Successfully!');
      this.updateCurrentInfo(cInfo);
      this.infoModalVisible = false;
    }, (error) => {
      this.isUpdatingConsultationInfo = false;
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
    if(form === 'cInfo') {
      this.consultationInfo.readMode = !this.consultationInfo.readMode;

      if(!this.consultationInfo.readMode) {
        this.enableCInfoEdit();
        return;
      }
    }
    
    if(this.consultationInfo.readMode)
      this.resetCInfo();

    return;
  }

  resetCInfo() {
    this.consultationInfo.form.reset();

    this.setCInfoValue();

    for(const key in this.consultationInfo.form.controls){
      this.consultationInfo.form.controls[key].disable();
      this.consultationInfo.form.controls[key].markAsPristine;
      this.consultationInfo.form.controls[key].updateValueAndValidity;
    }
  }

  enableCInfoEdit() {
    this.date?.enable();
    this.time?.enable();
    this.consultor?.enable();
    this.consultee?.enable();
    this.type?.enable();
    this.platform?.enable();
    this.comment?.enable();
    this.status?.enable();
  }

  setCInfoValue() {
    this.consultationInfo.form.setValue ({
      date: this.listOfSingleDisplayData[0].consultation_date,
      time: this.listOfSingleDisplayData[0].consultation_time,
      consultor: this.listOfSingleDisplayData[0].consultation_consultor,
      consultee: this.listOfSingleDisplayData[0].consultation_consultee,
      type: this.listOfSingleDisplayData[0].consultation_type,
      platform: this.listOfSingleDisplayData[0].consultation_platform,
      comment: this.listOfSingleDisplayData[0].consultation_comment,
      status: this.listOfSingleDisplayData[0].consultation_status,
    })
  }

  updateCurrentInfo(cInfo: any) {
    this.listOfSingleDisplayData[0].consultation_date = cInfo.date;
    this.listOfSingleDisplayData[0].consultation_time = cInfo.time;
    this.listOfSingleDisplayData[0].consultation_consultor = cInfo.consultor;
    this.listOfSingleDisplayData[0].consultation_consultee = cInfo.consultee;
    this.listOfSingleDisplayData[0].consultation_type = cInfo.type;
    this.listOfSingleDisplayData[0].consultation_platform = cInfo.platform;
    this.listOfSingleDisplayData[0].consultation_comment = cInfo.comment;
    this.listOfSingleDisplayData[0].consultation_status = cInfo.status;
  }
}
