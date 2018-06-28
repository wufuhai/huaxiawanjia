import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

//import { COMPONENTS } from '../app/const.components';

@NgModule({
    declarations: [
        //COMPONENTS,
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        //COMPONENTS,
        CommonModule,
    ]
})
export class SharedModule { }