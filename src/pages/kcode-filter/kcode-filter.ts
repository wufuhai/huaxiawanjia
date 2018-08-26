import { Component } from '@angular/core';

import { NavParams, ViewController, IonicPage } from 'ionic-angular';

import { DataProvider } from '../../providers/data';

@IonicPage()
@Component({
  selector: 'page-kcode-filter',
  templateUrl: 'kcode-filter.html'
})
export class KCodeFilterPage {
  devices: Array<{name: string, isChecked: boolean}> = [];

  constructor(
    public data: DataProvider,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    let excludedDeviceNames = this.navParams.data;



    this.data.kcodeGroups.forEach(_ => {
        this.devices.push({
          name: _.account.alias,
          isChecked: (excludedDeviceNames.indexOf(_.account.alias) === -1)
        });
      });

  }

  resetFilters() {
    // reset all of the toggles to be checked
    this.devices.forEach(track => {
      track.isChecked = true;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    let excludedTrackNames = this.devices.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
