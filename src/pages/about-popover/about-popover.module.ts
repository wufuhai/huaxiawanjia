import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { AboutPopoverPage } from './about-popover';

@NgModule({
  declarations: [
    AboutPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPopoverPage),
    SharedModule
  ],
  exports: [
    AboutPopoverPage
  ]
})

export class AboutPopoverPageModule { }