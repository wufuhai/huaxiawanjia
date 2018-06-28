import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

import { DataProvider } from '../../providers/data';

@IonicPage()
@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;

  constructor(
    public dataProvider: DataProvider,
    public navParams: NavParams
  ) { }
}
