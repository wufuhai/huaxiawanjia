import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,
  Config,
  NavController,
  IonicPage,
  ToastController,
  FabContainer,
  LoadingController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { DataProvider } from '../../providers/data';
import { WebApi } from '../../providers/webapi';
import { UtilProvider } from '../../providers/util';

export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean | void;
};

@IonicPage()
@Component({
  selector: 'page-account-list',
  templateUrl: 'account-list.html'
})
export class AccountListPage {

  iabRef: any;
  actionSheet: ActionSheet;
  
  selectedGodId: any;
  // today: any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public data: DataProvider,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    public api: WebApi,
    public util: UtilProvider) {


  }

  async ionViewWillEnter() {
    await this.data.load();
    // if (this.data.accounts.length == 0 && this.data.cookies.length > 0)
      this.refreshData(null);
  }

  async refreshData(fab: FabContainer) {

    if (fab)
      fab.close();

    if (this.data.accounts)
      this.data.accounts.splice(0, this.data.accounts.length)

    let loading = this.util.loading();

    loading.present();

    // await this.data.loadCookies();

    if (this.data.cookies) {
      for (const cookie of this.data.cookies) {
        await this.processCookie(cookie);
      }

      this.data.saveAccounts();
    }

    loading.dismiss();
  }

  async processCookie(cookie: any) {
    if (cookie) {
      var account = cookie;
      this.data.accounts.push(account);

      this.loadAccountInfo(account);
    }
  }

  async loadAccountInfo(account) {

    await this.api.getAccountInfo(account);

    await this.api.getFruitState(account);

    await this.api.getMyCoupons(account);

    await this.api.getKgift(account);
  }

  removeAccount(account) {
    this.data.removeAccount(account.god.id);
  }

  goToLogin(fab: FabContainer) {
    if (fab)
      fab.close();

    this.navCtrl.setRoot('LoginPage');
  }

  checkin(account) {
    this.api.checkin(account);
  }

  checkinAll(fab: FabContainer) {
    for (let acc of this.data.accounts) {
      this.checkin(acc);
    }

    if (fab)
      fab.close();
  }

  harvest(account: any) {
    this.api.harvest(account);
  }

  async harvestAll() {
    this.data.accounts.forEach(async (val) => {
      await this.api.harvest(val);
    });
  }

  login(account) {
    this.navCtrl.push('LoginPage', { user: { phone: account.god.phone, password: account.password } });
  }

  openAccount(account: any) {

    this.selectedGodId = account.god.id;

    this.util.openAccount(account);

  }

  isActive(account) {
    if (account.god.id == this.selectedGodId) {
      return 'primary';
    }
  }
}
