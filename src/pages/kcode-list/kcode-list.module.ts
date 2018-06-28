import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { KCodeListPage } from './kcode-list';

@NgModule({
  declarations: [
    KCodeListPage,
  ],
  imports: [
    IonicPageModule.forChild(KCodeListPage),
    SharedModule
  ],
  exports: [
    KCodeListPage
  ]
})

export class KCodeListPageModule { }