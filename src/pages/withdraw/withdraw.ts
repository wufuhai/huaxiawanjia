//import { DataProvider } from './../../providers/data';
import { WebApi } from './../../providers/webapi';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'WithdrawPage',
  segment: 'withdraw/:godId/:tokenId'
})
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  phone: any = '17817887760';
  smsCode;
  amount: any;
  countdown = 0;
  getCodeText: any = '获取短信验证码';
  account: any;
  godId: any;
  tokenId: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    //private data: DataProvider,
    private api: WebApi) {

    this.godId = navParams.get('godId');
    this.tokenId = navParams.get('tokenId');
    //this.account = this.data.getAccount(this.godId);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WithdrawPage');
  }

  getCode() {
    this.api.getCode(this.phone).subscribe(() => {
      this.countdown = 60;
      this.doCountdown();
    });
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
    this.api.withdraw(this.godId, this.tokenId, this.amount, this.phone, this.smsCode);
  }

  invalid() {
    return !this.amount || !this.smsCode;
  }
}
