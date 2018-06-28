import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { AccountListPage } from './account-list';

@NgModule({
  declarations: [
    AccountListPage, 
  ],
  imports: [
    IonicPageModule.forChild(AccountListPage),
    SharedModule
  ],
  exports: [
    AccountListPage
  ]
})

export class AccountListPageModule { }