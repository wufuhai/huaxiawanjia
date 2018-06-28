import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { SupportPage } from './support';

@NgModule({
  declarations: [
    SupportPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportPage),
    SharedModule
  ],
  exports: [
    SupportPage
  ]
})

export class SupportPageModule { }