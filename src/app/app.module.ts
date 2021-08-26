import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { DemoNgZorroAntdModule } from './ng-zoro-antd.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { ManageConsultationComponent } from './pages/manage-consultation/manage-consultation.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BasicInfoService } from './shared/services/basic-info.service';
import { ContactInfoService } from './shared/services/contact-info.service';
import { UserAddressService } from './shared/services/user-address.service';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { RegisterUsersComponent } from './pages/register-users/register-users.component';
import { InfoUsersComponent } from './pages/info-users/info-users.component';
import { AddConsultationComponent } from './pages/add-consultation/add-consultation.component';
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SettingsComponent,
    ManageUsersComponent,
    RegisterUsersComponent,
    ManageConsultationComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    InfoUsersComponent,
    AddConsultationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    DemoNgZorroAntdModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [BasicInfoService, ContactInfoService, UserAddressService, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
