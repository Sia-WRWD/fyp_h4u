import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { ManageUsersComponent } from './manage-users.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zoro-antd.module';


@NgModule({
    declarations: [ManageUsersComponent],
    imports: [
        CommonModule,
        ManageUsersRoutingModule,
        DemoNgZorroAntdModule,
    ]
})

export class ProfileModule { }