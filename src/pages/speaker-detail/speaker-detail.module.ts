import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { SpeakerDetailPage } from './speaker-detail';

@NgModule({
  declarations: [
    SpeakerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SpeakerDetailPage),
    SharedModule
  ],
  exports: [
    SpeakerDetailPage
  ]
})

export class SpeakerDetailPageModule { }