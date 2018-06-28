import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { Storage } from '@ionic/storage';

export class LoginCookie {
  password: string;
  loginKey: string;
  tokenId: string; // 用户认证令牌
  god: God
}

export class God {
  id: any; // 用户ID
  aliases: string; // 用户名
  fullName: string; // 真实姓名
  phone: string; // 手机号码
  email: string; // 用户邮箱
  picture: string; // 头像图片地址
  idNumber: string; //证件ID
  idType: string; // 证件类型
  userType: string;  // 用户类型 0 普通用户,1 为 VIP用户
  isIDNumber: string; // 证件验证标志(1为验证通过，0为未验证)
  isValidateBank: any // 银行卡验证标志(1为验证通过，0为未验证)
  recommendGodId: any; // 推荐人Id
  recommendTypeId: any; // 推荐类型Id
  godType: any; // 用户类型(投资人=1,借款人=2,担保公司=3,平台=4,体验标=5)
  rdmStr: string; //邀请码
  recommendTypeName: any; //用户等级`
}

export interface KCodeGroup {
  // deviceName: any;
  account: any;
  restDays: number;
  items: any[];
  hide: boolean;
}

@Injectable()
export class DataProvider {

  accounts: any[] = [];
  cookies: LoginCookie[];
  kcodeGroups: KCodeGroup[] = [];

  constructor(public storage: Storage) {

  }

  removeAccount(godId): any {

    const accIdx = this.accounts.findIndex(p => p.god.id === godId);

    if (accIdx > -1) {
      this.accounts.splice(accIdx, 1);
      this.saveAccounts();
    }

    const cookieIdx = this.cookies.findIndex(p => p.god.id === godId);

    if (cookieIdx > -1) {
      this.cookies.splice(cookieIdx, 1);
      this.saveCookies();
    }

    // empty all kcodes(to reload later)
    this.kcodeGroups.splice(0, this.kcodeGroups.length);
    this.saveKCodeGroups();
  }

  getAccount(godId): any {
    return this.accounts.find(_ => _.god.id == godId);
  }

  addCookie(cookie) {
    if (this.cookies == null)
      this.cookies = [];

    const cookieIndex = this.cookies.findIndex(p => p.god.id === cookie.god.id);
    if (cookieIndex !== -1) {
      this.cookies[cookieIndex] = cookie;
    }
    else {
      this.cookies.push(cookie);
    }

    this.saveCookies();
  }

  // loadCookies() {
  //   return new Promise((resolve, reject) => {
  //     if (this.cookies) {
  //       resolve(this.cookies);
  //     } else {
  //       this.storage.get('cookies').then((value: string) => {
  //         if (value) {
  //           let json = JSON.parse(value);
  //           this.cookies = json.data;
  //         }
  //         else this.cookies = [];
  //         resolve(this.cookies);
  //       }).catch(err => {
  //         reject(err)
  //       });
  //     }
  //   });
  // }

  async load() {
    await this.storage.get('cookies').then((value: string) => {
      if (value) {
        let json = JSON.parse(value);
        this.cookies = json.data;
      }
      else this.cookies = [];
    }).catch();

    await this.storage.get('accounts').then((value: string) => {
      if (value) {
        let json = JSON.parse(value);
        this.accounts = json.data;
      }
      else this.accounts = [];
    }).catch();

    await this.storage.get('kcode_groups').then((value: string) => {
      if (value) {
        let json = JSON.parse(value);
        this.kcodeGroups = json.data;
      }
      else this.kcodeGroups = [];
    }).catch();
  }

  public saveCookies() {
    this.storage.set('cookies', JSON.stringify({ data: this.cookies }));
  }

  public saveAccounts() {
    // this.storage.set('accounts', JSON.stringify({ data: this.accounts }));
  }

  public saveKCodeGroups() {
    // this.storage.set('kcode_groups', JSON.stringify({ data: this.kcodeGroups }));
  }
}
