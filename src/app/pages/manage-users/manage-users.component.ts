import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { manageUsers } from 'src/app/shared/models/manageUsers';
import { ManageUsersService } from 'src/app/shared/services/manage-users.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  tableParams!: NzTableQueryParams;
  searchStateValue = '';
  searchUsernameValue = '';
  searchRoleValue = '';
  total: number = 1;
  usernameSearchVisible: boolean = false;
  roleSearchVisible: boolean = false;
  stateSearchVisible: boolean = false;
  isLoading = true;
  pageSize: number = 10;
  pageIndex: number = 1;
  value: number = 0;

  listOfUserData: manageUsers[] = [];
  listOfDisplayData!: any[];

  constructor(
    private _manageUsersService: ManageUsersService,
    private router: Router,
    private messageService: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  //Fetch Data
  loadUserData(): void {
    this.isLoading = true;

    this._manageUsersService.getAllUserData().subscribe((manageUsers) => {
      this.listOfUserData = manageUsers;
      this.listOfDisplayData = [...this.listOfUserData];
      // console.log(this.listOfDisplayData)
      this.total = this.listOfDisplayData.length;

      this.isLoading = false;

    }, (error) => {
      console.log('Error Encountered: ', error);
    });
  }

  //Filters
  resetUsername(): void {
    this.searchUsernameValue = '';
    this.searchUsername();
    this.total = this.listOfDisplayData.length;
  }

  searchUsername(): void {
    this.usernameSearchVisible = false;
    this.listOfDisplayData = this.listOfUserData.filter((item: manageUsers) => item.user_username.indexOf(this.searchUsernameValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  resetRole(): void {
    this.searchRoleValue = '';
    this.searchRole();
    this.total = this.listOfDisplayData.length;
  }

  searchRole(): void {
    this.roleSearchVisible = false;
    this.listOfDisplayData = this.listOfUserData.filter((item: manageUsers) => item.user_role.indexOf(this.searchRoleValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  resetState(): void {
    this.searchStateValue = '';
    this.searchState();
    this.total = this.listOfDisplayData.length;
  }

  searchState(): void {
    this.stateSearchVisible = false;
    this.listOfDisplayData = this.listOfUserData.filter((item: manageUsers) => item.user_state.indexOf(this.searchStateValue) !== -1);
    this.total = this.listOfDisplayData.length;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.tableParams = params;
    this.listOfDisplayData;
  }

  //Reload Table
  reloadTable(): void {
    this.loadUserData();
    this.searchStateValue = '';
    this.searchUsernameValue = '';
    this.searchRoleValue = '';
    this.total = this.listOfDisplayData.length;
  }

  deleteUser(user_id: any, modelRef: NzModalRef) {
    this.isLoading = true;

    this._manageUsersService.deleteUserData(user_id).subscribe((res) => {
      this.messageService.create('success', 'User has Been Successfully Removed!');

      setTimeout(() => {
        modelRef.destroy();
      }, 10);

      this.reloadTable();
      this.isLoading = false;

    }, (error) => {
      if (error.status === 400) {
        this.messageService.create('error', 'Something Went Wrong, Please Try Again Later!');
      }

      if (error.status === 404) {
        this.messageService.create('error', 'Something Went Wrong, Please Contact the Admin!');
      }

      if (error.status === 403) {
        this.messageService.create('warning', 'Action Not Allowed!');
      }

      if (error.status === 401) {
        this.router.navigate(['/login']);
      }
    });
  }

  //User Info
  directInfoPage(user_id: any, modelRef: NzModalRef) {
    let url: string = "welcome/manage-users/info-users/" + user_id;
    this.router.navigate([url]);
    setTimeout(() => {
      modelRef.destroy();
    }, 10);
  }

  //Modals
  showOptions(user_id: any): void {
    const modal: NzModalRef = this.modal.create({
      nzTitle: 'View User Info or Delete User?',
      nzContent: `You can <i>View more details</i> of the user by
                 clicking on <b>"View"</b> and <i>Delete the user</i> by
                 clicking on <b>"Delete"</b>.`,
      nzFooter: [
        {
          label: 'View',
          type: 'primary',
          onClick: () => this.directInfoPage(user_id, modal)
        },
        {
          label: 'Delete',
          type: 'primary',
          onClick: () => this.modal.confirm({
            nzTitle: 'Are you sure you want to delete this user?',
            nzContent: 'This act is irreversible after execution!',
            nzOnOk: () => this.deleteUser(user_id, modal)
          })
        }

      ]
    })
  }
}


