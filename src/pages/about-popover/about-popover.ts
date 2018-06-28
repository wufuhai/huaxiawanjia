import { Component } from '@angular/core';

import { App, NavController, ModalController, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  template: `
    <ion-list>
      <button ion-item (click)="close('http://weixin.wanjiajinfu.com/mobile')">华夏万家官方APP</button>
      <button ion-item (click)="support()">反馈</button>
    </ion-list>
  `
})
export class AboutPopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController
  ) { }

  support() {
    this.app.getRootNav().push('SupportPage');
    this.viewCtrl.dismiss();
  }

  close(url: string) {
    window.open(url, '_blank');
    this.viewCtrl.dismiss();
  }
}