import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { manageConsultation } from 'src/app/shared/models/manageConsultation';
import { ManageConsultationService } from 'src/app/shared/services/manage-consultation.service';
import { ManageUsersService } from 'src/app/shared/services/manage-users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  //Drawer
  ConsultationID!: number;
  infoDrawerVisible: boolean = false;

  //Consultation
  listOfOngoingConsultation: manageConsultation[] = [];
  listOfDisplayData!: any[];
  listOfSingleOngoingConsultation: manageConsultation[] = [];
  listOfSingleDisplayData!: any[];
  totalConsultation: number = 1;
  totalOngoingConsultation: number = 1;

  //Users
  totalUsers: number = 1;

  constructor(
    private router: Router,
    private _manageConsultationService: ManageConsultationService,
    private _manageUsersService: ManageUsersService
  ) { }


  ngOnInit(): void {
    this.loadOngoingConsultation();
    this.loadAllUsers();
    this.loadAllConsultation();
  }

  //Users
  loadAllUsers() {
    this._manageUsersService.getAllUserData().subscribe((result) => {
      this.totalUsers = result.length;
      console.log(this.totalUsers);
    })
  }

  //Consultation
  loadAllConsultation() {
    this._manageConsultationService.getAllConsultationData().subscribe((result) => {
      this.totalConsultation = result.length;
      console.log(this.totalConsultation);
    })
  }

  loadOngoingConsultation() {
    this._manageConsultationService.getOngoingConsultationData().subscribe((manageConsultation) => {
      this.listOfOngoingConsultation = manageConsultation;
      this.listOfDisplayData = [...this.listOfOngoingConsultation];
      console.log(this.listOfDisplayData);
      this.totalOngoingConsultation = manageConsultation.length;
    });
  }

  fetchSingleConsultationData() {
    this._manageConsultationService.getConsultationData(this.ConsultationID).subscribe((manageConsultation) => {
      this.listOfSingleOngoingConsultation = manageConsultation;
      this.listOfSingleDisplayData = [...this.listOfSingleOngoingConsultation];
      console.log(this.listOfSingleDisplayData);
    });
  }

  //Drawer
  openCInfo(index: any): void {
    //Determine consultation id
    this.ConsultationID = this.listOfDisplayData[index].consultation_id;
    // console.log(this.ConsultationID);
    this.fetchSingleConsultationData();
    this.infoDrawerVisible = true;
  }

  closeCInfo(): void {
    this.infoDrawerVisible = false;
  }

  //Others
  directProfile(): void {
    this.router.navigate(['welcome/profile']);
  }

}
