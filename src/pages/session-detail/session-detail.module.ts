import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { SessionDetailPage } from './session-detail';

@NgModule({
  declarations: [
    SessionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SessionDetailPage),
    SharedModule
  ],
  exports: [
    SessionDetailPage
  ]
})

export class SessionDetailPageModule { }