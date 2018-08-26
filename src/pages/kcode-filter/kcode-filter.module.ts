import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { KCodeFilterPage } from './kcode-filter';

@NgModule({
  declarations: [
    //KCodeFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(KCodeFilterPage),
    SharedModule
  ],
  exports: [
    KCodeFilterPage
  ]
})
export class ScheduleFilterPageModule { }