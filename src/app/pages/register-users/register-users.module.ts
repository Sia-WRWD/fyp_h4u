import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterUsersRoutingModule } from './register-users-routing.module';
import { RegisterUsersComponent } from './register-users.component';
import { DemoNgZorroAntdModule } from 'src/app/ng-zoro-antd.module';


@NgModule({
  declarations: [
    RegisterUsersComponent
  ],
  imports: [
    CommonModule,
    RegisterUsersRoutingModule,
    DemoNgZorroAntdModule
  ]
})
export class RegisterUsersModule { }
