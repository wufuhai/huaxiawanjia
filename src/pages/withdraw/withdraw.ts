import { UtilProvider } from './../../providers/util';
import { DataProvider } from './../../providers/data';
import { WebApi } from './../../providers/webapi';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

declare var SMSReceive: any;

@IonicPage({
  name: 'WithdrawPage',
  segment: 'withdraw'
})
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  message: any;

  title: any;
  withdrawLogItems: any[] = [];

  phone: any;
  smsCode;
  amount: any = '60.00';
  countdown = 0;
  getCodeText: any = '获取短信验证码';
  godId: any;
  tokenId: any;
  balance: '0.00';

  selectedAccount: any;
  accounts: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private util: UtilProvider,
    private data: DataProvider,
    private api: WebApi) {

  }

  async ionViewWillEnter() {

    this.platform.ready().then(() => {
      // this.startSmsReceiveWatch();
    });

    await this.data.load();

    this.accounts = this.data.cookies;

    if (this.accounts && this.accounts.length > 0) {
      let account = this.accounts[0];
      this.selectAccount(account);
      this.phone = account.god.phone;
    }
  }

  startSmsReceiveWatch() {


    if (this.util.isDevice && SMSReceive) {

      try {
        SMSReceive.startWatch(() => {
          //this.util.toast('smsreceive: watching started').present();

          document.addEventListener('onSMSArrive', (e: any) => {
            this.util.toast('onSMSArrive()').present();
            var sms = e.data;
            console.log('sms.address:' + sms.address);
            console.log('sms.body:' + sms.body);
            this.util.toast(sms.body).present();
          });

        }, () => {
          // console.warn('smsreceive: failed to start watching');
        });


      }
      catch (error) {
        console.log(error);
      }
    }
  }

  stopSmsReceiveWatch() {
    if (this.util.isDevice && SMSReceive) {

      try {
        SMSReceive.stopWatch(function () {
          console.log('smsreceive: watching stopped');
        }, function () {
          console.warn('smsreceive: failed to stop watching');
        });
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  ionViewDidLeave() {

    // this.stopSmsReceiveWatch();

  }

  async refreshData() {
    this.withdrawLogItems = [];
    this.balance = '0.00';

    this.api.getRemain(this.godId, this.tokenId).subscribe((json: any) => {
      this.balance = this.util.fMc(json.withdrwalAmount);
    });

    this.api.getWithdrawLog(this.godId, this.tokenId, 1, 1).subscribe((json: any) => {
      var items = json.object;

      if (items && items.length > 0) {
        var item = items[0];

        let oprTime = new Date(item.oprTime);
        let today = new Date();

        if (oprTime.toDateString() === today.toDateString()) {

          this.withdrawLogItems.push({
            action: '今日 ' + item.oprTime.split(' ')[1] + ' 提现' + this.util.fMc2(item.amount) + '元',
            result: item.result,
            status: item.result == 1 ? '成功' : (item.result == 2 ? '失败' : '审核中')
          });
        }
      }

      if (this.withdrawLogItems.length == 0) {
        this.withdrawLogItems.push({ action: '今日未提现' });
      }

    });
  }

  selectAccount(account: any) {
    this.godId = account.god.id;
    this.tokenId = account.tokenId;
    this.countdown = 0;
    this.title = `${account.god.fullName}(${account.god.phone})`;
    this.selectedAccount = account;
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

      // this.watchSmsReceived();

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

  openWithdrawLog() {
    this.util.openAccount(this.selectedAccount, 'detalLogPostalCash.html');
  }
}
