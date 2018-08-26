import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, List, ModalController, NavController, ToastController, LoadingController, IonicPage } from 'ionic-angular';

import { WebApi } from '../../providers/webapi';
import { DataProvider } from '../../providers/data';
import { UtilProvider } from '../../providers/util';


@IonicPage()
@Component({
  selector: 'page-kcode-list',
  templateUrl: 'kcode-list.html'
})
export class KCodeListPage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('kcodeList', { read: List }) kcodeList: List;

  excludeDevices: any[] = [];
  filteredGroups: any[] = [];
  segment = '0';
  public searchText: any;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public api: WebApi,
    public data: DataProvider,
    public util: UtilProvider
  ) {

  }

  ionViewWillEnter() {
    this.refreshData(null);
  }

  async refreshData(fab: FabContainer) {

    this.searchText = '';
    this.filteredGroups = [];

    if (fab)
      fab.close();

    if (this.data.kcodeGroups)
      this.data.kcodeGroups.splice(0, this.data.kcodeGroups.length)

    let loading = this.util.loading();

    loading.present();

    await this.data.load();

    if (this.data.cookies) {
      for (const cookie of this.data.cookies) {
        this.processCookie(cookie);
      }
    }

    loading.dismiss();
  }

  processCookie(cookie: any) {
    if (cookie) {
      this.loadKcodes(cookie);
    }
  }

  loadKcodes(account) {

    this.api.getKcodes(account);
  }

  openAccount(account: any) {

    this.util.openAccount(account, 'kCodeGift.html');

  }

  searchItems(ev: any) {

    this.filteredGroups = [];
    // set val to the value of the searchbar
    let val = ev.target.value;
    let matched = null;

    const allGroups = this.data.kcodeGroups;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      val = val.toUpperCase();
      allGroups.forEach((g: any) => {

        if (matched)
          return;

        var group = this.filteredGroups.find(_ => _.account.god.id == g.account.god.id);

        g.items.forEach(item => {

          if (matched)
            return;

          if (item.kcode.toUpperCase().startsWith(val)) {

            matched = item;
            if (group == null) {
              group = { account: g.account, hide: g.hide, restDays: g.restDays, items: [] };
              this.filteredGroups.push(group);
            }
            group.items.push(item);
          }
        });
      });
    } else {
      this.filteredGroups = allGroups;
    }
  }

  public getDisplayData() {
    if (this.searchText) {
      return this.filteredGroups;
    }
    return this.data.kcodeGroups;
  }

  presentFilter() {
    let modal = this.modalCtrl.create('KCodeFilterPage', this.excludeDevices);
    modal.present();

    // modal.onWillDismiss((data: any[]) => {
    //   if (data) {
    //     this.excludeTracks = data;
    //     this.refreshData(null);
    //   }
    // });

  }

  // async doRefresh(refresher: Refresher) {

  //   if (this.segment == '0')
  //     for (let acc of this.accounts) {
  //       await this.api.getKcodes(acc);
  //     }
  //   else if (this.segment == '1') {
  //     for (let acc of this.accounts) {
  //       await this.api.getMyQuali(acc);
  //     }
  //   }
  //   refresher.complete();
  // }
}
