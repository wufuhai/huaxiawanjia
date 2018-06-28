import { Component } from '@angular/core';

import { NavParams, IonicPage } from 'ionic-angular';

@IonicPage({
  segment: 'tabs'
})
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = 'AccountListPage';
  tab2Root: any = 'KCodeListPage';
  tab3Root: any = 'AboutPage';
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
