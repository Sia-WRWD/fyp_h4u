import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NzResizableDirective } from 'ng-zorro-antd/resizable';
import { AddConsultationComponent } from '../add-consultation/add-consultation.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { InfoUsersComponent } from '../info-users/info-users.component';
import { ManageConsultationComponent } from '../manage-consultation/manage-consultation.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
import { ProfileComponent } from '../profile/profile.component';
import { RegisterUsersComponent } from '../register-users/register-users.component';
import { SettingsComponent } from '../settings/settings.component';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'manage-users', component: ManageUsersComponent},
      {path: 'manage-users/register-users', component: RegisterUsersComponent},
      {path: 'manage-users/info-users/:id', component: InfoUsersComponent },
      {path: 'manage-consultation', component: ManageConsultationComponent},
      {path: 'manage-consultation/add-consultation', component: AddConsultationComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'profile', component: ProfileComponent},
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
