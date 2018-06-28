import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { TutorialPage } from './tutorial';

@NgModule({
  declarations: [
    TutorialPage,
  ],
  imports: [
    IonicPageModule.forChild(TutorialPage),
    SharedModule
  ],
  exports: [
    TutorialPage
  ]
})

export class TutorialPageModule { }