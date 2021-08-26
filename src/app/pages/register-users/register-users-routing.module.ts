import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterUsersComponent } from './register-users.component';

const routes: Routes = [
  {path: '', component: RegisterUsersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterUsersRoutingModule { }
