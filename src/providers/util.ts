import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class UtilProvider {
  iabRef: any;
  loginData: any;

  constructor(public http: HttpClient, public loadingCtrl: LoadingController,
    public inAppBrowser: InAppBrowser) {

  }

  loading(content?: string) {
    let loading = this.loadingCtrl.create({
      content: content
    });

    return loading;
  }

  openAccount(account: any, gotoUrl: string) {

    const url = 'https://weixin.wanjiajinfu.com/mobile/financia.html';

    const json = JSON.stringify({
      tokenId: account.tokenId, // 用户认证令牌
      god: account.god
    });

    const code = `     
    (function initCookie() {
      
      function addCookie(key, value, time) {
        var r = key + "=" + escape(value);
        if(time > 0) {
          var i = new Date();
          i.setTime(i.getTime() + time * 24 * 3600 * 1000);
          r = r + "; expires=" + i.toGMTString() + "; path=/";
        } else {
          r = r + "; path=/";
        }
        document.cookie = r;
      }

      function loginCookie(json) {
        addCookie('tokenId', json.tokenId); //用户认证令牌
        addCookie('godId', json.god.id); //用户ID
        addCookie('aliases', json.god.aliases); //用户名
        addCookie('fullName', json.god.fullName); //真实姓名
        addCookie('phone', json.god.phone); //手机号码
        addCookie('email', json.god.email); //用户邮箱
        addCookie('picture', json.god.picture); //头像图片地址
        addCookie('idNumber', json.god.idNumber); //证件ID
        addCookie('idType', json.god.idType); //证件类型
        addCookie('userType', json.god.userType); //用户类型 0 普通用户,1 为 VIP用户
        addCookie('isIDNumber', json.god.isIDNumber); //证件验证标志(1为验证通过，0为未验证)
        addCookie('isValidateBank', json.god.isValidateBank); //银行卡验证标志(1为验证通过，0为未验证)
        addCookie('recommendGodId', json.god.recommendGodId); //推荐人Id
        addCookie('recommendTypeId', json.god.recommendTypeId);//推荐类型Id
        addCookie('godType', json.god.godType); //用户类型(投资人=1,借款人=2,担保公司=3,平台=4,体验标=5)
        addCookie('rdmStr', json.god.rdmStr); //邀请码
        addCookie('recommendTypeName',json.god.recommendTypeName);//用户等级
        return;
      }

      try{
        loginCookie(JSON.parse('${json}'));
        location.replace('${gotoUrl}');
      }
      catch(err){
        alert(err);
      }  
      
  }()); 

      `;

    this.loginData = null;

    let loading = this.loading('加载中...');
    loading.present();

    let iab = this.inAppBrowser.create(url, '_blank', 'location=false,hidden=yes');

    try {
      iab.on('loadstop').subscribe(() => {
        if (this.loginData)
          return;

        if (loading) {
          loading.dismiss();
          loading = null;
        }

        this.loginData = json;
        iab.show();
        iab.executeScript({ code: code });
      }, () => {
        if (loading) {
          loading.dismiss();
          loading = null;
        }
      });
    }
    catch (err) {
      console.log(err);
      if (loading) {
        loading.dismiss();
        loading = null;
      }
    }

  }

  fMc2(money) {
    money = parseFloat(money);
    if (money == 0) {
      return "0.00";
    } else {
      money = money + "";
      var pointIndex = money.indexOf(".") + 1;
      if (money.indexOf(".") != -1) {
        money = money.substring(0, pointIndex + 3);
      }
      var valLen = money.toString().split(".");
      if (valLen.length == 1) {
        money = money.toString() + ".00";
        return money;
      }
      if (valLen.length > 1) {
        if (valLen[1].length < 2) {
          money = money.toString() + "0";
        } else if (valLen[1].length > 2) {
          var val = valLen[1].substr(valLen[1].length - 1, 1);
          money = Number(money);
          if (val != "0" && val != 0 && val != "") {
            return this.fMc2(Math.ceil(money * 100) / 100);
          } else {
            return money.toFixed(2);
          }
        }
        return money;
      }
      return money;
    }
  }

  /*
 * 格式化金额
 */
  //保留两位小数
  fM(money) {
    money = Number(money);
    if (money == 0) {
      return "0.00";
    } else {
      return money.toFixed(2);
    }
  }

  //千分位
  fMc(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
      num = "0.00";
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    var sign = num.replace(/^(\d+)((\.\d+)?)$/, function (_s0, s1, s2) { return s1.replace(reg, "$&,") + s2; });
    return sign;
  }

  //保留4位小数-进一法
  fMc1(money) {
    money = parseFloat(money);
    if (money == 0) {
      return "0.0000";
    } else {
      money = money + "";
      var pointIndex = money.indexOf(".") + 1;
      if (money.indexOf(".") != -1) {
        money = money.substring(0, pointIndex + 5);
      }
      var valLen = money.toString().split(".");
      if (valLen.length == 1) {
        money = money.toString() + ".0000";
        return money;
      }
      if (valLen.length > 1) {
        if (valLen[1].length < 2) {
          money = money.toString() + "000";
        } else if (valLen[1].length < 3) {
          money = money.toString() + "00";
        } else if (valLen[1].length < 4) {
          money = money.toString() + "0";
        } else if (valLen[1].length >= 4) {
          var val = valLen[1].substr(valLen[1].length - 1, 1);
          money = Number(money);
          if (val != "0" && val != 0 && val != "") {
            if ((Math.ceil(money * 10000) / 10000).toString().split(".")[1].length < 4) {
              return this.fMc1(Math.ceil(money * 10000) / 10000);
            } else {
              return Math.ceil(money * 10000) / 10000;
            }
          } else {
            return money.toFixed(4);
          }
        }
        return money;
      }
      return money;
    }
  }

  public toTime(diff: number) {
    if (diff < 0)
      return '00:00:00';

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    if (mins < 10)
      return hours + ":0" + mins;

    return hours + ":" + mins;
  }
}
