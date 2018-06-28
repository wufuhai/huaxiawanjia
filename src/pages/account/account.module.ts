import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { AccountPage } from './account';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    SharedModule
  ],
  exports: [
    AccountPage
  ]
})

export class AccountPageModule { }