import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, IonicPage, ToastController, NavParams } from 'ionic-angular';

import { UserOptions } from '../../interfaces/user-options';
import { WebApi } from '../../providers/webapi';
import { DataProvider } from '../../providers/data';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController,
    public api: WebApi,
    public data: DataProvider,
    public navParams: NavParams,
    public toastCtrl: ToastController) {

    var user = this.navParams.get('user');
    if (user) {
      this.login.username = user.phone;
      this.login.password = user.password;
    }
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.api.login(this.login.username, this.login.password).subscribe((json: any) => {

        this.toastCtrl.create({ message: json.resultdesc, duration: 3000 });

        this.navCtrl.setRoot('AccountListPage');
      });
    }
  }

  onSignup() {
    this.navCtrl.push('SignupPage');
  }
}
