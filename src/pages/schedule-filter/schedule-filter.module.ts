import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { ScheduleFilterPage } from './schedule-filter';

@NgModule({
  declarations: [
    ScheduleFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleFilterPage),
    SharedModule
  ],
  exports: [
    ScheduleFilterPage
  ]
})
export class ScheduleFilterPageModule { }