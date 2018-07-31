import { UtilProvider } from './../../providers/util';
import { DataProvider } from './../../providers/data';
import { WebApi } from './../../providers/webapi';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'WithdrawPage',
  segment: 'withdraw'
})
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  withdrawLogItems: any[] = [];

  phone: any;
  smsCode;
  amount: any = '60.00';
  countdown = 0;
  getCodeText: any = '获取短信验证码';
  godId: any;
  tokenId: any;
  balance: '0.00';
  accounts: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private util: UtilProvider,
    private data: DataProvider,
    private api: WebApi) {

    //this.godId = navParams.get('godId');
    //this.tokenId = navParams.get('tokenId');
  }

  async ionViewWillEnter() {
    await this.data.load();

    this.accounts = this.data.cookies;

    if (this.accounts && this.accounts.length > 0) {
      let account = this.accounts[0];
      this.godId = account.god.id;
      this.tokenId = account.tokenId;
      this.phone = account.god.phone;
      this.refreshData();
    }
    // this.refreshData();
  }

  async refreshData() {

    this.api.getRemain(this.godId, this.tokenId).subscribe((json: any) => {
      this.balance = this.util.fMc(json.withdrwalAmount);
    });

    this.api.getWithdrawLog(this.godId, this.tokenId).subscribe((json: any) => {
      this.withdrawLogItems = json.object;
    });
  }

  selectAccount(account: any) {
    this.godId = account.god.id;
    this.tokenId = account.tokenId;
    this.countdown = 0;

    this.refreshData();
  }

  selectPhone(account: any) {
    this.phone = account.god.phone;
    this.countdown = 0;
  }

  ionViewDidLoad() {
  }

  getCode() {
    let loading = this.util.loading('');
    loading.present();
    this.api.getCode(this.phone).subscribe(() => {
      this.countdown = 60;
      loading.dismiss();
      this.doCountdown();
    }, () => { loading.dismiss(); });
  }

  doCountdown() {

    var self = this;
    if (this.countdown == 0) {
      this.getCodeText = '获取短信验证码';
      return false;
    } else {
      this.getCodeText = "重新发送(" + this.countdown + ")";
      this.countdown--;
    }
    setTimeout(function () {
      self.doCountdown();
    }, 1000);
  }

  withdraw() {
    let loading = this.util.loading('');
    loading.present();
    this.api.withdraw(this.godId, this.tokenId, this.amount, this.phone, this.smsCode).subscribe((json: any) => {
      this.refreshData();
      loading.dismiss();
    }, () => { loading.dismiss(); });
  }
}
