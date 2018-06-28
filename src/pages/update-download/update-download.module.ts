import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateDownloadPage } from './update-download';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UpdateDownloadPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateDownloadPage),
    ComponentsModule
  ],
})
export class UpdateDownloadPageModule {}
