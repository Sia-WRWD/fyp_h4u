import { NgModule } from '@angular/core';
import { DemoNgZorroAntdModule } from 'src/app/ng-zoro-antd.module';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';


@NgModule({
  imports: [
    WelcomeRoutingModule,
    DemoNgZorroAntdModule
  ],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
