import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

import { DataProvider } from '../../providers/data';

@IonicPage()
@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'speaker-detail.html'
})
export class SpeakerDetailPage {
  speaker: any;

  constructor(public dataProvider: DataProvider, public navCtrl: NavController, public navParams: NavParams) {
  }


  goToSessionDetail(session: any) {
    this.navCtrl.push('SessionDetailPage', { sessionId: session.id });
  }
}
