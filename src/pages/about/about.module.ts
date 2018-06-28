import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../shared/shared.module';
import { AboutPage } from './about';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPage),
    SharedModule,
    ComponentsModule
  ],
  exports: [
    AboutPage
  ]
})

export class AboutPageModule { }